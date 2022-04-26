var members = ['egoing', 'k8805', 'hoya'];

console.log(members[1]);

for (var i = 0; i < members.length; ++i)
{
  console.log('array for ', members[i]);
}

var roles = {
  'programmer':'egoing',
  'designer' : 'k8805',
  'manager':'hoya'};

console.log(roles.manager);

for(var name in roles)
{
  console.log('object for ', name, roles[name]);
}
