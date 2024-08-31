function createInputGroup(container, items) {
    var fileName = window.location.pathname.split('/').pop().split('.')[0];
    var containerId = container.attr('id').split('-')[0].split('#')[0];
    var isSkillOrFamiliar = (containerId === 'skill' || containerId === 'familiar');
    var isRelicsContainer = (containerId === 'relicsDamage' || containerId === 'relics' || containerId === 'relicsDPS');

    var inputType = isRelicsContainer ? 'text' : 'number';
    var inputClass = (containerId === 'relicsDamage') ? 'w-50' : 'w-75';
    var disabled = isRelicsContainer ? true : false;
    var max = isSkillOrFamiliar ? 100 : undefined;


    var inputCookieValue = getCookie("inputParameters");
    var inputParameters = inputCookieValue ? JSON.parse(inputCookieValue) : [];

    var checkboxCookieValue = getCookie("checkboxParameters");
    var checkboxParameters = checkboxCookieValue ? JSON.parse(checkboxCookieValue) : [];


    items.forEach(function (item) {
        var div = $('<div>', {class: 'input-group input-group-sm'});
        var span = $('<span>', {class: 'input-group-text ' + inputClass + ' tier-' + item.tiers});
        if (isSkillOrFamiliar || containerId === 'relics') {
            var img = $('<img>', {
                src: '/images/' + item.key.split("-")[0] + '/' + item.key.split("-")[1].substring(0, 2) + '.png',
                class: 'imgStyle'
            });
        } else {
            var img = $('<img>', {
                src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
                class: 'imgNoneStyle'
            });
        }
        span.append(img).append(item.name);


        var input = $('<input>', {
            type: inputType,
            class: 'form-control form-control-sm',
            id: item.key,
            max: max,
            disabled: disabled
        });

        var parameterItem = inputParameters.find(function(param) {
            return param.key === item.key;
        });
        input.val(parameterItem ? parameterItem.value : item.value);

        if(fileName !== "hunt-damage") {
            input.on('change', function () {
                relicsResult();
            });
            div.append(span).append(input);
        }else {
            if (isSkillOrFamiliar) {
                var checkboxDiv = $('<div>', {class: 'input-group-text'});
                var checkbox = $('<input>', {class: 'form-check-input m-0', type: 'checkbox', name:containerId, id:'check-'+item.key});
                checkbox.on('change', function() {
                    if (!checkMaxCheckboxes(containerId)) {
                        $(this).prop('checked', false);
                    }
                });

                var checkboxParameter = checkboxParameters.find(function(param) {
                    return param.key === 'check-' + item.key;
                });
                checkbox.prop('checked', checkboxParameter ? checkboxParameter.value : false);

                checkboxDiv.append(checkbox);
                div.append(span).append(input).append(checkboxDiv);
            }else {
                div.append(span).append(input);
            }
        }
        container.append(div);
    });
}

// 유물셋에 대한 데이터셋 업데이트
function datasetByRelicsSet_Update(datasetSpecs, datasetSkills, datasetFamiliars, relicsSet){
    var copy_datasetSpecs = structuredClone(datasetSpecs);
    var copy_datasetSkills = structuredClone(datasetSkills);
    var copy_datasetFamiliars = structuredClone(datasetFamiliars);

    var attackPower = getJsonValue(copy_datasetSpecs, 'attackPower');
    var skillCriticalProbability = getJsonValue(copy_datasetSpecs, 'skillCriticalProbability');
    var skillCriticalDamage = getJsonValue(copy_datasetSpecs, 'skillCriticalDamage');
    var skillCooldown = Math.min(getJsonValue(copy_datasetSpecs, 'skillCooldown'),60);
    var skillDamage = getJsonValue(copy_datasetSpecs, 'skillDamage');
    var familiarCriticalProbability = getJsonValue(copy_datasetSpecs, 'familiarCriticalProbability');
    var familiarCriticalDamage = getJsonValue(copy_datasetSpecs, 'familiarCriticalDamage');
    var familiarCooldown = Math.min(getJsonValue(copy_datasetSpecs, 'familiarCooldown'),60);
    var familiarDamage = getJsonValue(copy_datasetSpecs, 'familiarDamage');
    var normalMonsterDamage = getJsonValue(copy_datasetSpecs, 'normalMonsterDamage');
    var bossMonsterDamage = getJsonValue(copy_datasetSpecs, 'bossMonsterDamage');
    var finalDamage = getJsonValue(copy_datasetSpecs, 'finalDamage');

    var overCritical;

    var R1 = relicsSet[0];
    var R2 = relicsSet[1];
    var R3 = relicsSet[2];
    var R4 = relicsSet[3];

    // 자물쇠 보유 유무
    var hasLock = false;

    // 영웅의 낡은 보검 보유 유무
    var hasSword = false;

    // 맹수의 반지 보유 유무
    var hasRing = false;

    [R1, R2, R3, R4].forEach(function(relic) {
        switch (relic) {
            case 'relic-3b': //샐러맨더 꼬리
                skillCriticalProbability += 12;
                break;
            case 'relic-3f': //대해적의 보물 지도
                skillCriticalDamage += 200;
                break;
            case 'relic-3g': //강화 슬라임 조각
                familiarCriticalDamage += 200;
                break;
            case 'relic-3j': //평범한 자물쇠
                skillCooldown += 5;
                skillDamage += 400;
                hasLock = true;
                break;
            case 'relic-4a': //붉은 공명석
                copy_datasetSkills.forEach(function(item) {
                    if (item.key === 'skill-6c') {
                        item.name = "메테오(붉은 공명석)";
                        item.default = "2472";
                    }
                });
                break;
            case 'relic-4d': //사역마 훈련 일지
                familiarCooldown += 5;
                break;
            case 'relic-4f': //뇌전의 깃털
                skillCriticalProbability += 20;
                break;
            case 'relic-4g': //버려진 애착 인형
                familiarCriticalProbability += 20;
                break;
            case 'relic-5b': //고대 마법서
                skillDamage += 1600;
                break;
            case 'relic-5e': //네크로노미콘
                familiarDamage += 1600;
                break;
            case 'relic-5f': //미확인 큐브
                normalMonsterDamage += 50;
                bossMonsterDamage += 50;
                break;
            case 'relic-6c': //영웅의 낡은 보검
                hasSword = true;
                break;
            case 'relic-6d': //맹수의 반지
                hasRing = true;
                break;
            case 'relic-6e': //꿈의 룬 조각
                skillCriticalProbability += 30;
                familiarCriticalProbability += 30;
                break;
            case 'relic-6e1': //꿈의 룬 조각(보검)
                skillCriticalProbability += 30;
                familiarCriticalProbability += 30;
                hasSword = true;
                break;
            case 'relic-6e2': //꿈의 룬 조각(맹반)
                skillCriticalProbability += 30;
                familiarCriticalProbability += 30;
                hasRing = true;
                break;
            case 'relic-6e3': //꿈의 룬 조각(보검, 맹반)
                skillCriticalProbability += 30;
                familiarCriticalProbability += 30;
                hasSword = true;
                hasRing = true;
                break;
            case 'relic-3b1': //샐러맨더 꼬리(스치피 360+)
                skillCriticalDamage += 360;
                break;
            case 'relic-4f1': //뇌전의 깃털(스치피 600+)
                skillCriticalDamage += 600;
                break;
            case 'relic-4g1': //버려진 애착 인형(사치피 600+)
                familiarCriticalDamage += 600;
                break;
            default:
                break;
        }
    });

    if (hasRing && skillCriticalProbability > 100) {
        overCritical = parseInt(skillCriticalProbability)-100;
        skillCriticalDamage += overCritical * 30;
    }

    if (hasSword && familiarCriticalProbability > 100) {
        overCritical = parseInt(familiarCriticalProbability)-100;
        familiarCriticalDamage += overCritical * 30;
    }


    setJsonValue(copy_datasetSpecs, 'attackPower', attackPower);
    setJsonValue(copy_datasetSpecs, 'skillCriticalProbability', skillCriticalProbability);
    setJsonValue(copy_datasetSpecs, 'skillCriticalDamage', skillCriticalDamage);
    setJsonValue(copy_datasetSpecs, 'skillCooldown', skillCooldown);
    setJsonValue(copy_datasetSpecs, 'skillDamage', skillDamage);
    setJsonValue(copy_datasetSpecs, 'familiarCriticalProbability', familiarCriticalProbability);
    setJsonValue(copy_datasetSpecs, 'familiarCriticalDamage', familiarCriticalDamage);
    setJsonValue(copy_datasetSpecs, 'familiarCooldown', familiarCooldown);
    setJsonValue(copy_datasetSpecs, 'familiarDamage', familiarDamage);
    setJsonValue(copy_datasetSpecs, 'normalMonsterDamage', normalMonsterDamage);
    setJsonValue(copy_datasetSpecs, 'bossMonsterDamage', bossMonsterDamage);
    setJsonValue(copy_datasetSpecs, 'finalDamage', finalDamage);


    return {
        userSpecs: copy_datasetSpecs,
        datasetSkills: copy_datasetSkills,
        datasetFamiliars: copy_datasetFamiliars,
        hasLock: hasLock
    };
}

function cteateUseRelicsSetArray(datasetRelics, length) {
    var Copy_datasetRelics = structuredClone(datasetRelics);

    var relicKeys = Copy_datasetRelics.map(function(relic) {
        return relic.key;
    });

    var result = []; // 결과를 저장할 배열을 초기화합니다.

    var f = function(prefix, relicKeys) {
        for (var i = 0; i < relicKeys.length; i++) {
            if (prefix.length === length-1) {
                result.push(prefix.concat(relicKeys[i]));
            } else {
                f(prefix.concat(relicKeys[i]), relicKeys.slice(i + 1));
            }
        }
    };

    f([], relicKeys); // 빈 배열과 주어진 배열로 내부 함수를 처음 호출합니다.

    // 5f 유물이 포함된 조합을 필터링하고, 5f 유물만 포함된 조합을 추가합니다.
    var filteredResult = result.filter(function(combination) {
        return !combination.includes('relic-5f');
    });

        filteredResult.push(['relic-5f']);

    return filteredResult;
}

function calculateDamage(datasetSpecs, datasetSkills, datasetFamiliars, hasLock) {

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

    var totalSkillDamage = calculateTotalDamage(datasetSpecs, datasetSkills, userSkillSpec);
    var totalFamiliarDamage = calculateTotalDamage(datasetSpecs, datasetFamiliars, userFamiliarSpec);

    var topN = hasLock ? 5 : 6;
    var topNSkillDamage = totalSkillDamage.slice(0, topN);
    var topNFamiliarDamage = totalFamiliarDamage.slice(0, 4);

    // totalSkillDamage, totalFamiliarDamage 합쳐서 가장 작은 totalDamage를 가진 값을 리턴
    var totalDamages = topNSkillDamage.concat(topNFamiliarDamage).sort(function (a, b) {
        return a.totalDamage - b.totalDamage;
    });

    return totalDamages;
}

function getJsonValue(dataset, key) {
    const item = dataset.find(item => item.key === key);
    return item.value
}

function setJsonValue(dataset, key, value) {
    const item = dataset.find(item => item.key === key);
    item.value = value;
}

function calculateMultiplier(probability, damage) {
    if (probability === 0) {
        return 0; // 확률이 0일 경우 0을 반환
    }
    return probability >= 100 ? damage : damage / probability;
}

function calculateTotalDamage(datasetSpec, dataset, userSpec) {
    return dataset.map(function (item) {
        var level = Math.min(item.value, 100);
        var damage = parseFloat(item.default) + parseFloat(item.growth) * (level - 1);
        var totalDamage = userSpec * damage;

        return {
            "name": item.name,
            "key": item.key,
            "totalDamage": totalDamage
        };
    }).sort(function (a, b) {
        return b.totalDamage - a.totalDamage;
    });
}

function mergeDataSets(target, source) {
    target.forEach(function(item) {
        var sourceItem = source.find(function(sourceItem) {
            return item.key === sourceItem.key;
        });
            Object.assign(item, sourceItem);
    });
    return target;
}

function getContainerData(container) {
    var data = [];
    container.find('.input-group').each(function() {
        var spanText = $(this).find('span').text().trim();
        var input = $(this).find('input');
        var inputId = input.attr('id');
        var inputValue = parseFloat(input.val());

        data.push({
            name: spanText,
            key: inputId,
            value: inputValue
        });
    });
    return data;
}
