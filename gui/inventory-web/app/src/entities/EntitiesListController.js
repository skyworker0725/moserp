var IGNORE_PROPERTIES = ["links", "displayName", "version"];
function EntitiesListController($log, $rootScope, $scope, $state, $stateParams, EntitiesRepository) {

    $log.debug("EntitiesListController(" + JSON.stringify($stateParams) + ")");

    $scope.$state = $state;
    $scope.entityName = $stateParams.entityName;
    $scope.resources = $rootScope.resources;

    $scope.gridOptions = {
        enableSorting: true,
        enableFullRowSelection: true,
        multiSelect: false
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        $log.debug("Registered gridApi");
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var selection = gridApi.selection.getSelectedRows();
            if (selection.length > 0) {
                $scope.selectedObject = selection[0];
            } else {
                $scope.selectedObject = null;
            }
            $log.debug("Selected object: " + JSON.stringify($scope.selectedObject));
        });
    };

    $scope.createNew = function () {
        $state.go("entities.edit", {entityName: $scope.entityName});
    };

    $scope.edit = function () {
        if ($scope.selectedObject) {
            $log.debug("Edit: " + $scope.entityName + " - " + $scope.selectedObject.id);
            $state.go("entities.edit", {entityName: $scope.entityName, id: $scope.selectedObject.id});
        }
    };

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };


    EntitiesRepository.loadAll($scope.entityName, entitiesLoaded);


    function entitiesLoaded(entities) {
        $log.debug("Entites returned: " + JSON.stringify(entities));
        $scope.entities = entities;
        $scope.gridOptions.columnDefs = createColumnDefs($scope.entityName);
        $scope.gridOptions.data = entities;
    }

    function createColumnDefs(entityName) {
        var columnDefs = [];
        for (let propertyName in $rootScope.schemata[entityName].properties) {
            var column = {};
            column.name = propertyName;
            if (IGNORE_PROPERTIES.indexOf(propertyName) < 0) {
                columnDefs.push(column);
            }
        }
        return columnDefs;
    }

}


export default [
   '$log', '$rootScope', '$scope', '$state', '$stateParams',  'EntitiesRepository',
    EntitiesListController
];