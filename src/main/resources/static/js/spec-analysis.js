$(document).ready(function () {

    var Copy_dataSetSpec = JSON.parse(JSON.stringify(dataSetSpec));
    var Copy_dataSetSkill = JSON.parse(JSON.stringify(dataSetSkill));
    var Copy_dataSetFamiliar = JSON.parse(JSON.stringify(dataSetFamiliar));
    var Copy_dataSetRelics = JSON.parse(JSON.stringify(dataSetRelics));
    Copy_dataSetRelics.forEach(function(relic) {
        if (relic.key === "6e" || relic.key === "3b" || relic.key === "4f" || relic.key === "4g") {
            relic.use = 0;
        }
    });
    Copy_dataSetRelics.push({ name: "꿈의 룬 조각(보검만 적용)", tiers: "6", key: "6e1", use: 1});
    Copy_dataSetRelics.push({ name: "꿈의 룬 조각(맹반만 적용)", tiers: "6", key: "6e2", use: 1});
    Copy_dataSetRelics.push({ name: "꿈의 룬 조각(보검, 맹반)", tiers: "6", key: "6e3", use: 1});
    Copy_dataSetRelics.push({ name: "샐러맨더 꼬리(스치피 360+)", tiers: "3", key: "3b1", use: 1});
    Copy_dataSetRelics.push({ name: "뇌전의 깃털(스치피 600+)", tiers: "4", key: "4f1", use: 1});
    Copy_dataSetRelics.push({ name: "버려진 애착 인형(사치피 600+)", tiers: "4", key: "4g1", use: 1});

    createInputGroup($('#spec-container'), Copy_dataSetSpec);
    createInputGroup($('#skill-container'), Copy_dataSetSkill);
    createInputGroup($('#familiar-container'), Copy_dataSetFamiliar);
    createInputGroup($('#relics-container'), Copy_dataSetRelics);

    bossSetResult();

    $('#relics-dps-button').on('click', function() {
        calculateAllCombinations();
    });
});

function calculateAllCombinations() {
    var Copy_dataSetRelics = JSON.parse(JSON.stringify(dataSetRelics));

    var relicsResult = {};
    Copy_dataSetRelics.forEach(function(relic) {
        if (relic.use === 1) {
            relicsResult[relic.key] = relic;
        }
    });

    var relicKeys = Object.keys(relicsResult);
    var combinations = getCombinations(relicKeys, 4);
    var defaultDPS = relicsSetResult();
    var results = [];

    combinations.forEach(function(combination) {
        var resultDPS = relicsSetResult(
            "relics-" + combination[0],    "relics-" + combination[1],    "relics-" + combination[2],    "relics-" + combination[3]
        );
        var resultDPSBydefaultDPS = (resultDPS / defaultDPS * 100).toFixed(2) + "%";

        var relicNames = combination.map(function(key) {
            return relicsResult[key].name;
        });

        results.push({
            name: relicNames.join('-'),    key: combination.join('-'),    value: resultDPSBydefaultDPS,    use: 1
        });
    });

    results.sort(function(a, b) {
        return parseFloat(b.value) - parseFloat(a.value);
    });
    $('#relicsDPS-container').empty();
    createInputGroup($('#relicsDPS-container'), results);
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

function getCombinations(arr, n) {
    var result = []; // 결과를 저장할 배열을 초기화합니다.
    var f = function(prefix, arr) { // 재귀적으로 호출될 내부 함수를 정의합니다.
        for (var i = 0; i < arr.length; i++) { // 배열의 각 요소에 대해 반복합니다.
            if (prefix.length === n - 1) { // 현재 조합의 길이가 n-1이면,        result.push(prefix.concat(arr[i])); // 현재 요소를 추가하여 결과 배열에 추가합니다.
            } else { // 그렇지 않으면,        f(prefix.concat(arr[i]), arr.slice(i + 1)); // 현재 요소를 추가하고 나머지 요소들로 재귀 호출합니다.
            }
        }
    };
    f([], arr); // 빈 배열과 주어진 배열로 내부 함수를 처음 호출합니다.

    // 5f 유물이 포함된 조합을 필터링하고, 5f 유물만 포함된 조합을 추가합니다.
    var filteredResult = result.filter(function(combination) {
        return !combination.includes('5f');
    });

    if (arr.includes('5f')) {
        filteredResult.push(['5f']);
    }

    return filteredResult; // 결과 배열을 반환합니다.
}

function getContainerData(container) {
    var data = {};
    container.find('.input-group').each(function() {
        var spanText = $(this).find('span').text().trim();
        var input = $(this).find('input');
        var inputId = input.attr('id');
        var inputValue = parseFloat(input.val());

        data[inputId] = {
            name: spanText,    key: inputId,    value: inputValue
        };
    });
    return data;
}

function bossSetResult() {
    var defaultDPS = relicsSetResult();
    console.log("defaultDPS", defaultDPS);
    var relicsResult = getContainerData($('#relics-container'));

    for (var key in relicsResult) {
        if (relicsResult.hasOwnProperty(key)) {
            var inputId = relicsResult[key].key;
            var resultDPS = relicsSetResult(inputId);
            var resultDPSBydefaultDPS = (resultDPS / defaultDPS * 100).toFixed(2) + "%";
            $('#' + inputId).val(resultDPSBydefaultDPS);
        }
    }
    sortRelicsContainer();

}

function relicsSetResult(relics1, relics2, relics3, relics4) {
    var Copy_userSpec = JSON.parse(JSON.stringify(getContainerData($('#spec-container'))));
    var Copy_skillLevel = JSON.parse(JSON.stringify(getContainerData($('#skill-container'))));
    var Copy_familiarLevel = JSON.parse(JSON.stringify(getContainerData($('#familiar-container'))));
    var Copy_dataSetSkill = JSON.parse(JSON.stringify(dataSetSkill));
    var Copy_dataSetFamiliar = JSON.parse(JSON.stringify(dataSetFamiliar));

    // 자물쇠 있으면 topN = 5
    var topN = 6;

    // 영웅의 낡은 보검 보유 유무
    var hasSword = false;

    // 맹수의 반지 보유 유무
    var hasRing = false;

    [relics1, relics2, relics3, relics4].forEach(function(relic) {
        switch (relic) {
            case 'relics-3b': //샐러맨더 꼬리
                Copy_userSpec.skillCriticalProbability.value += 12;
                break;
            case 'relics-3f': //대해적의 보물 지도
                Copy_userSpec.skillCriticalDamage.value += 200;
                break;
            case 'relics-3g': //강화 슬라임 조각
                Copy_userSpec.familiarCriticalDamage.value += 200;
                break;
            case 'relics-3j': //평범한 자물쇠
                Copy_userSpec.skillCooldown.value += 5;
                Copy_userSpec.skillDamage.value += 400;
                topN = 5;
                break;
            case 'relics-4a': //붉은 공명석
                Copy_dataSetSkill.forEach(function(item) {
                    if (item.key === '6c') {
                        item.name = "메테오(붉은 공명석)";
                        item.default = "2472";
                    }
                });
                break;
            case 'relics-4d': //사역마 훈련 일지
                Copy_userSpec.familiarcooldown.value += 5;
                break;
            case 'relics-4f': //뇌전의 깃털
                Copy_userSpec.skillCriticalProbability.value += 20;
                break;
            case 'relics-4g': //버려진 애착 인형
                Copy_userSpec.familiarCriticalProbability.value += 20;
                break;
            case 'relics-5b': //고대 마법서
                Copy_userSpec.skillDamage.value += 1600;
                break;
            case 'relics-5e': //네크로노미콘
                Copy_userSpec.familiarDamage.value += 1600;
                break;
            case 'relics-5f': //미확인 큐브
                Copy_userSpec.normalMonsterDamage.value += 50;
                Copy_userSpec.bossMonsterDamage.value += 50;
                break;
            case 'relics-6c': //영웅의 낡은 보검
                hasSword = true;
                break;
            case 'relics-6d': //맹수의 반지
                hasRing = true;
                break;
            case 'relics-6e': //꿈의 룬 조각
                Copy_userSpec.skillCriticalProbability.value += 30;
                Copy_userSpec.familiarCriticalProbability.value += 30;
                break;
            case 'relics-6e1': //꿈의 룬 조각(보검)
                Copy_userSpec.skillCriticalProbability.value += 30;
                Copy_userSpec.familiarCriticalProbability.value += 30;
                hasSword = true;
                break;
            case 'relics-6e2': //꿈의 룬 조각(맹반)
                Copy_userSpec.skillCriticalProbability.value += 30;
                Copy_userSpec.familiarCriticalProbability.value += 30;
                hasRing = true;
                break;
            case 'relics-6e3': //꿈의 룬 조각(보검, 맹반)
                Copy_userSpec.skillCriticalProbability.value += 30;
                Copy_userSpec.familiarCriticalProbability.value += 30;
                hasSword = true;
                hasRing = true;
                break;
            case 'relics-3b1': //샐러맨더 꼬리(스치피 360+)
                Copy_userSpec.skillCriticalDamage.value += 360;
                break;
            case 'relics-4f1': //뇌전의 깃털(스치피 600+)
                Copy_userSpec.skillCriticalDamage.value += 600;
                break;
            case 'relics-4g1': //버려진 애착 인형(사치피 600+)
                Copy_userSpec.familiarCriticalDamage.value += 600;
                break;
            default:
                break;
        }
    });

    if (hasRing && Copy_userSpec.skillCriticalProbability.value > 100) {
        var overCritical = parseInt(Copy_userSpec.skillCriticalProbability.value-100);
        Copy_userSpec.skillCriticalDamage.value += overCritical * 30;
    }

    if (hasSword && Copy_userSpec.familiarCriticalProbability.value > 100) {
        var overCritical = parseInt(Copy_userSpec.familiarCriticalProbability.value-100);
        Copy_userSpec.familiarCriticalDamage.value += overCritical * 30;
    }

    var defaultDPSArray = calculateValue(Copy_userSpec, Copy_skillLevel, Copy_familiarLevel, Copy_dataSetSkill, Copy_dataSetFamiliar);
    var topNSkillDPS = defaultDPSArray.totalSkillDPS.slice(0, topN);
    var topNFamiliarDPS = defaultDPSArray.totalFamiliarDPS.slice(0, 4);
    var seletedSkill = topNSkillDPS.reduce(function (sum, skill) { return sum + skill.totalDPS; }, 0);
    var seletedFamiliar = topNFamiliarDPS.reduce(function (sum, familiar) { return sum + familiar.totalDPS; }, 0);

    var finalDPS = seletedSkill + seletedFamiliar;


    console.log("finalDPS", finalDPS);
    console.log("finalDPS By seletedSkill", seletedSkill/finalDPS);
    console.log("finalDPS By seletedFamiliar", seletedFamiliar/finalDPS);

    return finalDPS;
}

function calculateValue(specData, skillData, familiarData, dataSetSkill, dataSetFamiliar) {

    var attackPower = specData.attackPower.value;
    var skillCriticalProbability = specData.skillCriticalProbability.value;
    var skillCriticalDamage = specData.skillCriticalDamage.value;
    var skillCooldown = Math.min(specData.skillCooldown.value,60);
    var skillDamage = specData.skillDamage.value;
    var familiarCriticalProbability = specData.familiarCriticalProbability.value;
    var familiarCriticalDamage = specData.familiarCriticalDamage.value;
    var familiarCooldown = Math.min(specData.familiarCooldown.value,60);
    var familiarDamage = specData.familiarDamage.value;
    var normalMonsterDamage = specData.normalMonsterDamage.value;
    var bossMonsterDamage = specData.bossMonsterDamage.value;
    var finalDamage = specData.finalDamage.value;

    var skillCriticalMultiplier = skillCriticalProbability >= 100 ? skillCriticalDamage : skillCriticalDamage / skillCriticalProbability;
    var familiarCriticalMultiplier = familiarCriticalProbability >= 100 ? familiarCriticalDamage : familiarCriticalDamage / familiarCriticalProbability;

    var userSkillSpec = attackPower*skillCriticalMultiplier*skillDamage*bossMonsterDamage*finalDamage;
    var userFamiliarSpec = attackPower*familiarCriticalMultiplier*familiarDamage*bossMonsterDamage*finalDamage;

    var totalSkillDPS = dataSetSkill.map(function (item) {
        var level = Math.min(skillData["skill-" + item.key].value, 100);
        var damage = parseFloat(item.default) + parseFloat(item.growth) * (level - 1);
        var cooldown = parseFloat(item.cool) * (1 - (skillCooldown / 100));
        var totalDPS = userSkillSpec * damage * parseFloat(item.hits) / cooldown;

        return {
            "name": item.name,    "key": item.key,    "totalDPS": totalDPS
        };
    });

    // 데이터를 value 기준으로 내림차순 정렬
    totalSkillDPS.sort(function (a, b) {
        return b.totalDPS - a.totalDPS;
    });

    var totalFamiliarDPS = dataSetFamiliar.map(function (item) {
        var level = Math.min(familiarData["familiar-" + item.key].value, 100);
        var damage = parseFloat(item.default) + parseFloat(item.growth) * (level - 1);
        var cooldown = parseFloat(item.cool) * (1 - (familiarCooldown / 100));
        var totalDPS = userFamiliarSpec * damage * parseFloat(item.hits) / cooldown;

        return {
            "name": item.name,    "key": item.key,    "totalDPS": totalDPS
        };
    });

    // 데이터를 value 기준으로 내림차순 정렬
    totalFamiliarDPS.sort(function (a, b) {
        return b.totalDPS - a.totalDPS;
    });


    var totalDPS = {
        totalSkillDPS: totalSkillDPS,totalFamiliarDPS: totalFamiliarDPS
    };

    return totalDPS;
}

function createInputGroup(container, items) {
    var containerId = container.attr('id').split('-')[0].split('#')[0];
    var imagePath = '/images/' + containerId + '/';
    var id;
    var name;
    var inputType = (containerId === 'relics' || containerId === 'relicsDPS') ? 'text' : 'number';
    var max = (containerId === 'skill' || containerId === 'familiar') ? 100 : undefined;

    items.forEach(function (item) {
        if (item.use) {
            var div = $('<div>', { class: 'input-group input-group-sm' });

            var span = $('<span>', {
                class: 'input-group-text tier-' + item.tiers + ' col-8',        id: 'inputGroup-sizing-sm'
            });

            if (containerId === 'spec' || containerId === 'relicsDPS') {
                var img = $('<img>', {
                    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',            class: 'imgNoneStyle',            alt: item.name
                });
                span.append(img).append(item.name);
                id = item.key;
                name = item.key;
            } else {
                var img = $('<img>', {
                    src: imagePath + item.key.substring(0, 2) + '.png',            class: 'imgStyle',            alt: item.name
                });
                span.append(img).append(item.name);
                id = containerId + "-" + item.key;
                name = containerId + "-" + item.key;
            }

            var input = $('<input>', {
                type: inputType,        class: 'form-control',        'aria-label': 'Sizing input',        'aria-describedby': 'inputGroup-sizing-sm',        name: name,        id: id,        value: item.value,        max: max
            });

            if (containerId === 'relics' || containerId === 'relicsDPS') {
                input.attr('readOnly', true);
            } else {
                input.on('change', function () {
                    bossSetResult();
                });
            }

            div.append(span).append(input);
            container.append(div);
        }
    });
}