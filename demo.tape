Output assets/demo.gif
Output assets/demo.mp4

Require curl
Require jq

Set Shell bash
Set Width 1000
Set Height 600
Set FontSize 18
Set Padding 20
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms

Sleep 500ms
Type "curl -s https://api.saitoudayooooon-jo.com/api/v1/characters/takumi-fujiwara | jq"
Sleep 300ms
Enter
Sleep 3.5s

Hide
Type "clear"
Enter
Show

Type "curl -s 'https://api.saitoudayooooon-jo.com/api/v1/battles?passId=akina' | jq '.data[] | {id, winnerCharacterId}'"
Sleep 300ms
Enter
Sleep 3s

Hide
Type "clear"
Enter
Show

Type "curl -s https://api.saitoudayooooon-jo.com/api/v1/vehicles/toyota-ae86-trueno | jq .data.specifications"
Sleep 300ms
Enter
Sleep 3.5s
