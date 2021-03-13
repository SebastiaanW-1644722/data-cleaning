$(document).ready(function () {
    $("#waiting-div").css({ "display": "none!important" })
    $("#main-container").show()
    $(".clustercolumns").change(function () {
        var tablename = $('#tablename').text()
        var checked_value = $(this).is(':checked')
        var url = "/setclustercolumns/"
        url = url.concat(tablename)
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({ column: $(this).val(), checked: checked_value })
        });
    })
    $(".denialconstraint").change(function () {
        var tablename = $('#tablename').text()
        var checked_value = $(this).is(':checked')
        var url = "/setdenialconstraint/"
        url = url.concat(tablename)
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({ id: $(this).val(), checked: checked_value })
        });
    })
    $("#addUniqueConstraint").click(function () {
        // get all checked checkboxes
        var tablename = $('#tablename').text()
        var url = "/uniqueconstraint/"
        url = url.concat(tablename)
        var columns = []
        $.each($("#uniqueConstraintForm input[name='column']:checked"), function () {
            columns.push($(this).val())
        })
        if (columns.length > 0) {
            // Send new constraint to backend
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: url,
                data: JSON.stringify({ data: columns, action: "add" }),
                success: function (newID) {
                    // append to list
                    $("#uniqueConstraintForm input[name='column']:checked").each(function () {
                        this.checked = false
                    })
                    $("#uniqueConstraints").append(`<li id='${newID.toString()}'>${columns}<button class='deleteUniqueConstraint btn' value='${newID.toString()}'><i class='fas fa-trash-alt'></i></button></li>`)
                    $("#noUniqueConstraints").hide()
                }
            });
        }
    })
    $("#uniqueConstraints").on('click', '.deleteUniqueConstraint', function () {
        var id = $(this).val()
        var tablename = $('#tablename').text()
        var url = "/uniqueconstraint/"
        url = url.concat(tablename)
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({ id: id, action: "delete" }),
            success: function () {
                var selector = "#".concat(id)
                $(selector).remove()
                if ($('.deleteUniqueConstraint').length == 0) {
                    $("#noUniqueConstraints").show()
                }
            }
        });
    })
    $("#clean").click(function () {
        var table_to_clean = $(this).data("table")
        var url = "/clean/"
        url = url.concat(table_to_clean)
        $("#clean").prop('disabled', true)
        $.ajax({
            type: "GET",
            url: url,
            success: function () {
                $("#clean").prop('disabled', false)
                var text = "Successfully cleaned table ".concat(table_to_clean)
                $("#success-cleaned-message").text(text)
                $("#clean-success").fadeIn()
            },
            error: function () {
                $("#clean").prop('disabled', false)
                var text = "An error occurred while cleaning table ".concat(table_to_clean, ", watch the console for more details.")
                $("#error-cleaned-message").text(text)
                $("#clean-error").fadeIn()
            }
        });
    })
    $('#select-all').click(function () {
        $(".functional-dependency:checkbox").each(function (i, obj) {
            $(this).prop("checked", true);
            var tablename = $('#tablename').text()
            var checked_value = $(this).is(':checked')
            var url = "/setfunctionaldependency/"
            url = url.concat(tablename)
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                async: false,
                url: url,
                data: JSON.stringify({ id: $(this).val(), checked: checked_value })
            });
        })
    })
    $('#unselect-all').click(function () {
        $(".functional-dependency:checkbox").each(function (i, obj) {
            $(this).prop("checked", false);
            var tablename = $('#tablename').text()
            var checked_value = $(this).is(':checked')
            var url = "/setfunctionaldependency/"
            url = url.concat(tablename)
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                async: false,
                url: url,
                data: JSON.stringify({ id: $(this).val(), checked: checked_value })
            });
        })
    })
    $(".functional-dependency").change(function () {
        var tablename = $('#tablename').text()
        var checked_value = $(this).is(':checked')
        var url = "/setfunctionaldependency/"
        url = url.concat(tablename)
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({ id: $(this).val(), checked: checked_value })
        });
    })
    $('#discover_fds').click(function () {
        $("#fd_results").addClass("d-none")
        $("#fds_loading").removeClass("d-none")
        $("#fds_loading").addClass("d-flex")
        $("#discovery_error").addClass("d-none")
        $("#discover_fds").prop('disabled', true)
        $("#visualize_results").prop('disabled', true)
        //TODO: Get parameters
        var table = $(this).data("table")
        var url = "/discover_fds/"
        url = url.concat(table)
        $.ajax({
            type: "GET",
            url: url,
            success: function (fds_template) {
                $("#discover_fds").prop('disabled', false)
                $("#visualize_results").prop('disabled', false)
                $("#fds_loading").addClass("d-none")
                $("#fd_results").removeClass("d-none")
                $("#fds_loading").removeClass("d-flex")
                $('#fds').html(fds_template);
            },
            error: function (error) {
                $("#discover_fds").prop('disabled', false)
                $("#visualize_results").prop('disabled', false)
                $("#fds_loading").addClass("d-none")
                $("#discovery_error").removeClass("d-none")
                $("#fds_loading").removeClass("d-flex")
                console.log(error)
            }
        });
    })
    $('#visualize_results').click(function () {
        $("#fd_results").addClass("d-none")
        $("#fds_loading").removeClass("d-none")
        $("#fds_loading").addClass("d-flex")
        $("#discovery_error").addClass("d-none")
        $("#discover_fds").prop('disabled', true)
        $("#visualize_results").prop('disabled', true)
        
        $("#results_file_input").click(); 
    })
    $("#parameters :input").change(function () {
        var tablename = $('#tablename').text()
        var url = "/setdiscoveryparameters/"
        url = url.concat(tablename)
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({ sample: $("#sample").is(':checked'), sample_size: parseFloat($("#samplesize").val()), threshold_table: $("#thresholdtable").is(':checked'), fd_threshold: parseFloat($("#fdthreshold").val()), workers: parseInt($("#workers").val()), bin_columns: $("#bincolumns").is(':checked'), include_nulls: $("#includenulls").is(':checked'), arity: parseInt($("#arity").val()) })
        });

    })
    $("#results_file_input").change(function (e) {
        const reader = new FileReader();
        var file = e.target.files[0];
        if (file.type != 'application/json') {
            alert("File should be in JSON format.");
            return;
        }
        reader.onload = function (e) {
            var fileContents = JSON.parse(e.target.result);
            var url = "/visualize_results"
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: url,
                data: JSON.stringify(fileContents),
                success: function (fds_template) {
                    $("#discover_fds").prop('disabled', false)
                    $("#visualize_results").prop('disabled', false)
                    $("#fds_loading").addClass("d-none")
                    $("#fd_results").removeClass("d-none")
                    $("#fds_loading").removeClass("d-flex")
                    $('#fds').html(fds_template);
                },
                error: function (error) {
                    $("#discover_fds").prop('disabled', false)
                    $("#visualize_results").prop('disabled', false)
                    $("#fds_loading").addClass("d-none")
                    $("#discovery_error").removeClass("d-none")
                    $("#fds_loading").removeClass("d-flex")
                    console.log(error)
                }
            });
        };
        reader.readAsText(file);

    })

})
function loadMetaData(fd) {
    //Distribution Charts
    var lhsCanvasId = "lhsdistribution" + fd.columns.join("_")
    var lhsDistribution = fd.most_frequent_x
    drawDistributionChart(lhsCanvasId, lhsDistribution)

    var rhsCanvasId = "rhsdistribution" + fd.columns.join("_")
    var rhsDistribution = fd.most_frequent_y
    drawDistributionChart(rhsCanvasId, rhsDistribution)

    $('.progress-bar[data-toggle="tooltip"]').tooltip();
}
function drawDistributionChart(canvasId, distribution) {

    var values = Object.values(distribution)

    data = {
        datasets: [{
            data: values,
            backgroundColor: getColors(values.length),
            borderWidth: 0
        }],

        labels: Object.keys(distribution)
    };

    var display_legend = values.length <= 20

    options = {
        responsive: true,
        legend: {
            position: 'left',
            display: display_legend,
        },
        title: {
            display: false,
        },
        animation: {
            animateScale: false,
            animateRotate: false
        }
    }

    var ctx = document.getElementById(canvasId).getContext('2d');
    var distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}
function getColors(num) {
    var possible_colors = ['#808080', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#008000', '#00FFFF', '#0000FF', '#000080', '#FF00FF', '#800080', '#00ffff', '#f0ffff', '#f5f5dc', '#000000', '#0000ff', '#a52a2a', '#00ffff', '#00008b', '#008b8b', '#a9a9a9', '#006400', '#bdb76b', '#8b008b', '#556b2f', '#ff8c00', '#9932cc', '#8b0000', '#e9967a', '#9400d3', '#ff00ff', '#ffd700', '#008000', '#4b0082', '#f0e68c', '#add8e6', '#e0ffff', '#90ee90', '#d3d3d3', '#ffb6c1', '#ffffe0', '#00ff00', '#ff00ff', '#800000', '#000080', '#808000', '#ffa500', '#ffc0cb', '#800080', '#800080', '#ff0000', '#c0c0c0', '#ffffff', '#ffff00']
    // var possible_colors = ["red", "blue", "yellow", "green", "black", "gray", "purple", "navy", "orange", "brown", "coral", "olive", "turquoise", "darkred", "tan", "thistle" ]
    // var sliced_colors = colors.slice(0,num)
    // return sliced_colors
    var colors = [];
    while (colors.length < num) {
        var n_colors_to_add = Math.min(possible_colors.length, num - colors.length)
        var colors_to_add = possible_colors.slice(0, n_colors_to_add)
        colors = colors.concat(colors_to_add)
    }

    return colors
}
function initUsedRows() {
    $('.progress-bar[data-toggle="tooltip"]').tooltip();
}