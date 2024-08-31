$(document).ready(function () {
    var copy_datasetRelics = structuredClone(datasetRelics);

    copy_datasetRelics.forEach(function(relic) {
        if (relic.key === "relic-6e" || relic.key === "relic-3b" || relic.key === "relic-4f" || relic.key === "relic-4g") {
            relic.use = 0;
        }
    });

    var modify_datasetRelics = copy_datasetRelics.filter(function(relic) {
        return relic.use === 1
    });

    modify_datasetRelics.push({ name: "꿈의 룬 조각(보검만 적용)", tiers: "6", key: "relic-6e1", use: 1});
    modify_datasetRelics.push({ name: "꿈의 룬 조각(맹반만 적용)", tiers: "6", key: "relic-6e2", use: 1});
    modify_datasetRelics.push({ name: "꿈의 룬 조각(보검, 맹반)", tiers: "6", key: "relic-6e3", use: 1});
    modify_datasetRelics.push({ name: "샐러맨더 꼬리(스치피 360+)", tiers: "3", key: "relic-3b1", use: 1});
    modify_datasetRelics.push({ name: "뇌전의 깃털(스치피 600+)", tiers: "4", key: "relic-4f1", use: 1});
    modify_datasetRelics.push({ name: "버려진 애착 인형(사치피 600+)", tiers: "4", key: "relic-4g1", use: 1});

    createInputGroup($('#spec-container'), structuredClone(datasetSpecs));
    createInputGroup($('#skill-container'), structuredClone(datasetSkills));
    createInputGroup($('#familiar-container'), structuredClone(datasetFamiliars));
    createInputGroup($('#relics-container'), modify_datasetRelics);

    relicsResult();

    $('#relics-dps-button').on('click', function() {
        relicsSetResult();
    });
});

function relicsSetResult() {
    var get_datasetSpecs = structuredClone(getContainerData($('#spec-container')));
    var get_datasetSkillLevels = structuredClone(getContainerData($('#skill-container')));
    var get_datasetFamiliarLevels = structuredClone(getContainerData($('#familiar-container')));
    var copy_datasetSkills = structuredClone(datasetSkills);
    var copy_datasetFamiliars = structuredClone(datasetFamiliars);
    var copy_datasetRelics = structuredClone(datasetRelics);

    var merge_datasetSkills = mergeDataSets(copy_datasetSkills, get_datasetSkillLevels);
    var merge_datasetFamiliars = mergeDataSets(copy_datasetFamiliars, get_datasetFamiliarLevels);

    // parameters 값을 쿠키로 저장
    var inputParameters = get_datasetSpecs.concat(get_datasetSkillLevels).concat(get_datasetFamiliarLevels);
    setCookie("inputParameters", JSON.stringify(inputParameters), 7);

    var defaultDPSArray = calculateDPS(get_datasetSpecs, merge_datasetSkills, merge_datasetFamiliars, false);
    var defaultDPS = defaultDPSArray.reduce(function(sum, item) {
        return sum + item.totalDPS;
    }, 0);

    // 유물 셋 계산 시 사용할 유물만 가져오기
    var modify_datasetRelics = copy_datasetRelics.filter(function(relic) {
        return relic.use === 1;
    });

    // 사용할 유물 셋 가져오기
    var useRelicsSetArray = cteateUseRelicsSetArray(modify_datasetRelics,4);

    var results = [];

    useRelicsSetArray.forEach(function(useRelicsSet) {
        // 유물셋에 대한 데이터셋 업데이트
        var datasetUpdateArray = datasetByRelicsSet_Update(get_datasetSpecs, merge_datasetSkills, merge_datasetFamiliars, useRelicsSet);
        var modify_userSpecs = datasetUpdateArray.userSpecs;
        var modify_datasetSkills = datasetUpdateArray.datasetSkills;
        var modify_datasetFamiliars = datasetUpdateArray.datasetFamiliars;
        var hasLock = datasetUpdateArray.hasLock;

        // 업데이트 된 데이터셋으로 데미지 계산
        var resultDPSArray = calculateDPS(modify_userSpecs, modify_datasetSkills, modify_datasetFamiliars, hasLock);

        var relicNames = useRelicsSet.map(function (key) {
            var relic = modify_datasetRelics.find(function(item) {
                return item.key === key;
            });
            return relic.name;
        });

        var resultDPS = resultDPSArray.reduce(function(sum, item) {
            return sum + item.totalDPS;
        }, 0);
        var resultDPSBydefaultDPS = (resultDPS / defaultDPS * 100).toFixed(2) + "%";

        results.push({
            name: relicNames.join(' / '),
            value: resultDPSBydefaultDPS,
            use: 1,
            result: resultDPS
        });
    });

    results.sort(function(a, b) {
        return parseFloat(b.result) - parseFloat(a.result);
    });


    $('#relicsDPS-container').empty();
    createInputGroup($('#relicsDPS-container'), results);
}

function calculateDPS(datasetSpecs, datasetSkills, datasetFamiliars, hasLock) {

    var attackPower = getJsonValue(datasetSpecs, 'attackPower');
    var skillCriticalProbability = getJsonValue(datasetSpecs, 'skillCriticalProbability');
    var skillCriticalDamage = getJsonValue(datasetSpecs, 'skillCriticalDamage');
    var skillCooldown = Math.min(getJsonValue(datasetSpecs, 'skillCooldown'),60);
    var skillDamage = getJsonValue(datasetSpecs, 'skillDamage');
    var familiarCriticalProbability = getJsonValue(datasetSpecs, 'familiarCriticalProbability');
    var familiarCriticalDamage = getJsonValue(datasetSpecs, 'familiarCriticalDamage');
    var familiarCooldown = Math.min(getJsonValue(datasetSpecs, 'familiarCooldown'),60);
    var familiarDamage = getJsonValue(datasetSpecs, 'familiarDamage');
    var normalMonsterDamage = getJsonValue(datasetSpecs, 'normalMonsterDamage');
    var bossMonsterDamage = getJsonValue(datasetSpecs, 'bossMonsterDamage');
    var finalDamage = getJsonValue(datasetSpecs, 'finalDamage');

    var skillCriticalMultiplier = calculateMultiplier(skillCriticalProbability, skillCriticalDamage);
    var familiarCriticalMultiplier = calculateMultiplier(familiarCriticalProbability, familiarCriticalDamage);

    // Define a common factor to reduce the size of the numbers
    const factor = 1e10; // Example factor, adjust as needed

    // Adjust the calculations by dividing by the factor
    var userSkillSpec = (attackPower * skillCriticalMultiplier * skillDamage * normalMonsterDamage * finalDamage) / factor;
    var userFamiliarSpec = (attackPower * familiarCriticalMultiplier * familiarDamage * normalMonsterDamage * finalDamage) / factor;

    var totalSkillDPS = calculateTotalDPS(datasetSpecs, datasetSkills, userSkillSpec);
    var totalFamiliarDPS = calculateTotalDPS(datasetSpecs, datasetFamiliars, userFamiliarSpec);

    var topN = hasLock ? 5 : 6;
    var topNSkillDPS = totalSkillDPS.slice(0, topN);
    var topNFamiliarDPS = totalFamiliarDPS.slice(0, 4);

    var totalDPS = topNSkillDPS.concat(topNFamiliarDPS).sort(function (a, b) {
        return b.totalDPS - a.totalDPS;
    });

    return totalDPS;
}

function calculateTotalDPS(datasetSpec, dataset, userSpec) {

    var skillCooldown = Math.min(getJsonValue(datasetSpec, 'skillCooldown'),60);

    return dataset.map(function (item) {
        var level = Math.min(item.value, 100);
        var damage = parseFloat(item.default) + parseFloat(item.growth) * (level - 1);
        var cooldown = parseFloat(item.cool) * (1 - (skillCooldown / 100));
        var totalDPS = userSpec * damage * parseFloat(item.hits) / cooldown;

        return {
            "name": item.name,
            "key": item.key,
            "totalDPS": totalDPS
        };
    }).sort(function (a, b) {
        return b.totalDPS - a.totalDPS;
    });
}

function relicsResult() {

    var get_datasetSpecs = structuredClone(getContainerData($('#spec-container')));
    var get_datasetSkillLevels = structuredClone(getContainerData($('#skill-container')));
    var get_datasetFamiliarLevels = structuredClone(getContainerData($('#familiar-container')));
    var copy_datasetSkills = structuredClone(datasetSkills);
    var copy_datasetFamiliars = structuredClone(datasetFamiliars);
    var copy_datasetRelics = structuredClone(getContainerData($('#relics-container')));

    var merge_datasetSkills = mergeDataSets(copy_datasetSkills, get_datasetSkillLevels);
    var merge_datasetFamiliars = mergeDataSets(copy_datasetFamiliars, get_datasetFamiliarLevels);


    var defaultDPSArray = calculateDPS(get_datasetSpecs, merge_datasetSkills, merge_datasetFamiliars, false);
    var defaultDPS = defaultDPSArray.reduce(function(sum, item) {
        return sum + item.totalDPS;
    }, 0);


    var useRelicsSetArray = cteateUseRelicsSetArray(copy_datasetRelics,1);

    useRelicsSetArray.forEach(function(useRelicsSet) {
        var datasetUpdateArray = datasetByRelicsSet_Update(get_datasetSpecs, merge_datasetSkills, merge_datasetFamiliars, useRelicsSet);
        var modify_userSpecs = datasetUpdateArray.userSpecs;
        var modify_datasetSkills = datasetUpdateArray.datasetSkills;
        var modify_datasetFamiliars = datasetUpdateArray.datasetFamiliars;
        var hasLock = datasetUpdateArray.hasLock;

        // 업데이트 된 데이터셋으로 데미지 계산
        var resultDPSArray = calculateDPS(modify_userSpecs, modify_datasetSkills, modify_datasetFamiliars, hasLock);

        var resultDPS = resultDPSArray.reduce(function(sum, item) {
            return sum + item.totalDPS;
        }, 0);

        var resultDPSBydefaultDPS = (resultDPS / defaultDPS * 100).toFixed(2) + "%";

        $('#' + useRelicsSet).val(resultDPSBydefaultDPS);

    });
    sortRelicsContainer();
}

function sortRelicsContainer() {
    var container = $('#relics-container');
    var relics = container.children('.input-group').get();

    relics.sort(function(a, b) {
        var aValue = parseFloat($(a).find('input').val());
        var bValue = parseFloat($(b).find('input').val());
        return bValue - aValue; // Sort in descending order
    });

    $.each(relics, function(index, relic) {
        container.append(relic);
    });
}