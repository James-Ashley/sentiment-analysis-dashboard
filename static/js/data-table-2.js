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

$(window).on("load", setupData);