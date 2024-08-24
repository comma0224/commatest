$(document).ready(function() {
    var table20 = $('#cooldownTable20').DataTable({
        paging: false, // Disable pagination
        searching: false, // Disable search
        info: false, // Disable info text
        autoWidth: false, // Disable automatic column width calculation
        columns: [
            { width: '10%' }, // Set width for the first column
            { width: '90%' }  // Set width for the remaining columns
        ]
    });
    var table30 = $('#cooldownTable30').DataTable({
        paging: false, // Disable pagination
        searching: false, // Disable search
        info: false, // Disable info text
        autoWidth: false, // Disable automatic column width calculation
        columns: [
            { width: '10%' }, // Set width for the first column
            { width: '90%' }  // Set width for the remaining columns
        ]
    });
    var headerRow20 = $('#cooldownTable20 thead tr');
    var headerRow30 = $('#cooldownTable30 thead tr');

    // Filter skills with tiers >= 5
    var filteredSkills = dataSetSkill.filter(function(skill) {
        return parseInt(skill.tiers) >= 5;
    });

    // Add skill names to table headers
    filteredSkills.forEach(function(skill) {
        headerRow20.append('<th>' + skill.name + '</th>');
        headerRow30.append('<th>' + skill.name + '</th>');
    });

    var previousRow20 = null;
    var previousRow30 = null;

    // Calculate cooldown reduction effects from 10% to 60% in 0.01% increments
    for (var cooldownReduction = 10; cooldownReduction <= 60; cooldownReduction += 0.01) {
        var row20 = '<tr><td class="small" style="text-align: center;">' + cooldownReduction.toFixed(2) + '%</td>';
        var row30 = '<tr><td class="small" style="text-align: center;">' + cooldownReduction.toFixed(2) + '%</td>';

        var currentRow20 = [];
        var currentRow30 = [];

        filteredSkills.forEach(function(skill, index) {
            var originalCooldown = parseFloat(skill.cool);
            var reducedCooldown = originalCooldown * (1 - cooldownReduction / 100);
            var hitsIn20Sec = Math.floor(20 / reducedCooldown);
            var hitsIn30Sec = Math.floor(30 / reducedCooldown);

            currentRow20.push(hitsIn20Sec);
            currentRow30.push(hitsIn30Sec);

            // Highlight changed values and add small class
            var cell20 = '<td class="small" style="text-align: center;">' + hitsIn20Sec + '</td>';
            var cell30 = '<td class="small" style="text-align: center;">' + hitsIn30Sec + '</td>';
            if (previousRow20 && previousRow20[index] !== hitsIn20Sec) {
                cell20 = '<td class="small changeColumn" style="text-align: center;">' + hitsIn20Sec + '</td>';
            }
            if (previousRow30 && previousRow30[index] !== hitsIn30Sec) {
                cell30 = '<td class="small changeColumn" style="text-align: center;">' + hitsIn30Sec + '</td>';
            }

            row20 += cell20;
            row30 += cell30;
        });

        row20 += '</tr>';
        row30 += '</tr>';

        // Check if the current row is the same as the previous row (excluding originalCooldown)
        if (JSON.stringify(currentRow20) !== JSON.stringify(previousRow20)) {
            table20.row.add($(row20)).draw();
            previousRow20 = currentRow20.slice(); // Create a copy of the current row
        }

        if (JSON.stringify(currentRow30) !== JSON.stringify(previousRow30)) {
            table30.row.add($(row30)).draw();
            previousRow30 = currentRow30.slice(); // Create a copy of the current row
        }
    }
});