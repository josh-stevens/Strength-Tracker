angular.module('strengthTracker', [])

.controller('strengthTrackerCtrl', function($scope, $http) {

  $scope.newWorkout = function(uid) {

    // Get HTML5 date in a form that SQL likes

    var date = $scope.date.toJSON().slice(0,10);

    // CHECK FOR EMPTY FIELDS, SET THEM TO NULL
    // TODO: find a better way to do this!

    if ($scope.weight1 === '') $scope.weight1 = null;
    if ($scope.weight2 === '') $scope.weight2 = null;
    if ($scope.weight3 === '') $scope.weight3 = null;
    if ($scope.weight4 === '') $scope.weight4 = null;
    if ($scope.weight5 === '') $scope.weight5 = null;
    if ($scope.reps1 === '') $scope.reps1 = null;
    if ($scope.reps2 === '') $scope.reps2 = null;
    if ($scope.reps3 === '') $scope.reps3 = null;
    if ($scope.reps4 === '') $scope.reps4 = null;
    if ($scope.reps5 === '') $scope.reps5 = null;

    // Send form data to database API

    var req = {method: 'POST', url: '/api/db', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, data: {uid:uid, date: date, exercise: $scope.exercise, set_1: [$scope.weight1, $scope.reps1], set_2: [$scope.weight2, $scope.reps2], set_3:[$scope.weight3, $scope.reps3],
                           set_4: [$scope.weight4, $scope.reps4], set_5: [$scope.weight5, $scope.reps5]}};

    console.log("Sending query");
    
    // Reset form fields....better way to do this?

    $http(req).then(function(res) {
      console.log("Query sent");
      $scope.weight1 = '';
      $scope.weight2 = '';
      $scope.weight3 = '';
      $scope.weight4 = '';
      $scope.weight5 = '';
      $scope.reps1 = '';
      $scope.reps2 = '';
      $scope.reps3 = '';
      $scope.reps4 = '';
      $scope.reps5 = '';
      $scope.render();
    });

  };

  $scope.render = function() {

    $http.get('/api/db').success(function(res) {

      var x = [];
      var y = [];

      for (var key in res) {
        x.push(key);
        y.push(res[key]);
      }

      console.log(x);
      console.log(y);

      var data = {
        labels: x,
        datasets: [
          {
              label: "Squats",
              fillColor: "rgba(255,153,0,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: y
          }
        ]
      };

      var ctx = document.getElementById("myChart").getContext("2d");
      if (typeof myLineChart === 'undefined') {
        myLineChart = new Chart(ctx).Line(data);
      }
      else {
        myLineChart.addData([y[y.length-1]], x[x.length-1]);
      }

    });

    
  };

  $scope.render();

});