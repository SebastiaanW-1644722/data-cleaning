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
    $("body").on("change",".functional-dependency", function() {
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
    $("body").on("click", "#discover_fds", function() {
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
    $("body").on("click", "#visualize_results", function() {
        $("#fd_results").addClass("d-none")
        $("#fds_loading").removeClass("d-none")
        $("#fds_loading").addClass("d-flex")
        $("#discovery_error").addClass("d-none")
        $("#discover_fds").prop('disabled', true)
        $("#visualize_results").prop('disabled', true)

        $("#results_file_input").click();
    })
    $("body").on("change","#parameters :input", function() {
        var table = $('#tablename').text()
        var url = "/setdiscoveryparameters/"
        url = url.concat(table)
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify({
                sample: $("#sample").is(':checked'),
                sample_size: parseFloat($("#samplesize").val()),
                threshold_table: $("#thresholdtable").is(':checked'),
                fd_threshold: parseFloat($("#fdthreshold").val()),
                workers: parseInt($("#workers").val()),
                bin_columns: $("#bincolumns").is(':checked'),
                include_nulls: $("#includenulls").is(':checked'),
                arity: parseInt($("#arity").val()),
                conf_dominant_y_pct: parseFloat($("#confdominant").val()),
                conf_rfi_threshold: parseFloat($("#confrfi").val()),
                conf_low_pct_rows: parseFloat($("#confrows").val()),
                conf_high_score: parseFloat($("#confhighscore").val()),
                conf_large_group: parseFloat($("#conflargegroup").val())
            })
        });

    })
    $("body").on("change","#results_file_input", function(e) {
        const reader = new FileReader();
        var file = e.target.files[0];
        if (file.type != 'application/json') {
            alert("File should be in JSON format.");
            return;
        }
        reader.onload = function (e) {
            var fileContents = JSON.parse(e.target.result);
            var table = $('#tablename').text()
            var url = "/visualize_results/"
            url = url.concat(table)
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
    $("body").on("input","#strictness_range", function(e) {
        var threshold = e.target.value;
        document.getElementById("strictness_value").innerHTML = threshold;
    })
    $("body").on("mouseup","#strictness_range", function(e) {
        var threshold = e.target.value;
        var table = $('#tablename').text()
        var url = "/adjust_strictness/"
        url = url.concat(table)
        url = url.concat("?threshold=" + threshold)

        $.ajax({
            type: "GET",
            url: url,
            success: function (fds_template) {
                $('#fds').html(fds_template);
            },
            error: function (error) {
                $("#discover_fds").prop('disabled', false)
                $("#visualize_results").prop('disabled', false)
                $("#discovery_error").removeClass("d-none")
                $("#fd_results").addClass("d-none")
                $("#fd_results").removeClass("d-flex")
                console.log(error)
            }
        });
        
    })
})