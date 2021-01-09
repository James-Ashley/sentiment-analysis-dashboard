// This function makes an API call to pull data and then returns a formatted datatable
function setupData() {
    $(document).ready(function () {
        $('#data').DataTable({
            "ajax": {
                "url": "/api/datatable",
                "dataType": "json",
                "dataSrc": "data",
                "contentType": "application/json",
                'responsive': true
            },
            "columns": [
                { "data": "Keyword" },
                { "data": "Source" },
                { "data": "Author" },
                { "data": "Title" },
                { "data": "URL" },
                { "data": "Published" },
                { 'data': 'Compound Score' },
                { 'data': 'Sentiment Category' }
            ]
        });
    });
}

// Create event listener so that datatable initializes on page load
$(window).on("load", setupData);