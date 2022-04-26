var number = [1, 400, 12, 34, 5];
var total = 0;

for (var i = 0; i < number.length; ++i)
{
  total = total + number[i];
  console.log(number[i]);
}

console.log(`total : ${total}`);
