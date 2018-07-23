var $table = $('#fresh-table'),
    full_screen = false,
    window_height;

$().ready(function(){

    window_height = $(window).height();
    table_height = window_height - 20;


    $table.bootstrapTable({
        toolbar: ".toolbar",

        showRefresh: false,
        search: true,
        showToggle: false,
        showColumns: false,
        pagination: true,
        striped: true,
        sortable: true,
        height: table_height,
        pageSize: 25,
        pageList: [25,50,100],

        formatShowingRows: function(pageFrom, pageTo, totalRows){
            //do nothing here, we don't want to show the text "showing x of y from..."
        },
        formatRecordsPerPage: function(pageNumber){
            return pageNumber + " rows visible";
        },
        icons: {
            refresh: 'fa fa-refresh',
            toggle: 'fa fa-th-js',
            columns: 'fa fa-columns',
            detailOpen: 'fa fa-plus-circle',
            detailClose: 'fa fa-minus-circle'
        }
    });

    $(window).resize(function () {
        $table.bootstrapTable('resetView');
    });
});