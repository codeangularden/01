flight reservation

want to calculate the total fair based on no of passengers and flight amnt

Do u need any help.

calculate total fair:

method 1:

no of passangers: n
Fair per head = 100 for example

so total = n * 100

Below grid directly bind $scope.Total = n * 100


method 2:
var total = 0;
for(i=0; i< $scope.PassangerList.length;i++)
{
  var pass = $scope.PassangerList[i];
  total = total + pass.Fair;
}


