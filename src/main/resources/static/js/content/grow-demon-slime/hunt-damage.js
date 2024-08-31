$(document).ready(function () {
    createInputGroup($('#spec-container'), structuredClone(datasetSpecs));
    createInputGroup($('#skill-container'), structuredClone(datasetSkills));
    createInputGroup($('#familiar-container'), structuredClone(datasetFamiliars));

    $('#relics-damage-button').on('click', function() {
        huntSetResult();
    });
});
function huntSetResult() {
    // 값 가져오기
    var get_datasetSpecs = structuredClone(getContainerData($('#spec-container')));
    var get_datasetSkillLevels = structuredClone(getContainerData($('#skill-container')));
    var get_datasetFamiliarLevels = structuredClone(getContainerData($('#familiar-container')));
    var copy_datasetSkills = structuredClone(datasetSkills);
    var copy_datasetFamiliars = structuredClone(datasetFamiliars);
    var copy_datasetRelics = structuredClone(datasetRelics);

    var merge_datasetSkills = mergeDataSets(copy_datasetSkills, get_datasetSkillLevels);
    var merge_datasetFamiliars = mergeDataSets(copy_datasetFamiliars, get_datasetFamiliarLevels);

    // 선택된 체크박스의 id값 가져오기
    var selectedSkills = $('.form-check-input[name=skill]:checked').map(function() {
        return this.id;
    }).get();
    var selectedFamiliars = $('.form-check-input[name=familiar]:checked').map(function() {
        return this.id;
    }).get();

    // 선택된 체크박스의 길이가 조건에 안맞으면 리턴
    if (selectedSkills.length < 6 || selectedFamiliars.length < 4) {
        errorBox('스킬은 6개, 사역마는 4개를 선택 해주세요.');
        return;
    }

    var checkboxParameters = [];
    // 체크박스 상태 저장
    $('.form-check-input').each(function() {
        checkboxParameters.push({
            key: $(this).attr('id'),
            value: $(this).prop('checked')
        });
    });
    setCookie("checkboxParameters", JSON.stringify(checkboxParameters), 7);

    // parameters 값을 쿠키로 저장
    var inputParameters = get_datasetSpecs.concat(get_datasetSkillLevels).concat(get_datasetFamiliarLevels);
    setCookie("inputParameters", JSON.stringify(inputParameters), 7);

    // 저장된 체크박스 키값으로 Copy_dataset와 키값이 같은것으로만 데이터셋을 만들기
    var selected_datasetSkills = selectedSkills.map(function(skill) {
        return merge_datasetSkills.find(function(item) {
            return "check-"+item.key === skill;
        });
    });

    var selected_datasetFamiliars = selectedFamiliars.map(function(familiar) {
        return merge_datasetFamiliars.find(function(item) {
            return "check-"+item.key === familiar;
        });
    });


    var defaultDamageArray = calculateDamage(get_datasetSpecs, selected_datasetSkills, selected_datasetFamiliars, false);
    var defaultDamage = defaultDamageArray[0].totalDamage;
    var defaultName = defaultDamageArray[0].name;

    // 유물 셋 계산 시 사용할 유물만 가져오기
    var modify_datasetRelics = copy_datasetRelics.filter(function(relic) {
        return relic.use === 1 && relic.key !== 'relic-3j';
    });

    // 사용할 유물 셋 가져오기
    var useRelicsSetArray = cteateUseRelicsSetArray(modify_datasetRelics,4);

    var results = [];

    useRelicsSetArray.forEach(function(useRelicsSet) {
        // 유물셋에 대한 데이터셋 업데이트
        var datasetUpdateArray = datasetByRelicsSet_Update(get_datasetSpecs, selected_datasetSkills, selected_datasetFamiliars, useRelicsSet);
        var modify_userSpecs = datasetUpdateArray.userSpecs;
        var modify_datasetSkills = datasetUpdateArray.datasetSkills;
        var modify_datasetFamiliars = datasetUpdateArray.datasetFamiliars;
        var hasLock = datasetUpdateArray.hasLock;

        // 업데이트 된 데이터셋으로 데미지 계산
        var resultDamageArray = calculateDamage(modify_userSpecs, modify_datasetSkills, modify_datasetFamiliars, hasLock);

        var relicNames = useRelicsSet.map(function (key) {
            var relic = modify_datasetRelics.find(function(item) {
                return item.key === key;
            });
            return relic.name;
        });

        var resultBydefault = (resultDamageArray[0].totalDamage/defaultDamage * 100).toFixed(2) + "%";
        var resultMessage = "1타 데미지가 가장 약한것은 '" + resultDamageArray[0].name + "' 입니다. 비교군 보다 " + resultBydefault + " 강합니다.";


        results.push({
            name: relicNames.join(' / '),
            value: resultMessage,
            result: resultDamageArray[0].totalDamage,
            use: 1
        });
    });

    results.sort(function(a, b) {
        return parseFloat(b.result) - parseFloat(a.result);
    });

    $('#relicsDamage-container').empty();
    var div = $('<div>', {
        class: 'h5 my-3',
        text: '비교군 : 유물 미 장착 시 "' + defaultName + '" 가 가장 약합니다.'
    });

    $('#relicsDamage-container').append(div);
    createInputGroup($('#relicsDamage-container'), results);
}


function checkMaxCheckboxes(containerId) {
    var maxCount = containerId === 'skill' ? 6 : 4;

    var checkedCount = $('.form-check-input[name='+containerId+']:checked').length;

    if (checkedCount > maxCount) {
        var alertMessage = '최대 ' + maxCount + '개까지 선택 가능합니다.';
        alertBox(alertMessage);
        return false;
    }
    return true;
}