module.exports = {
	name: 'roll',
    description: 'Roll!',
    help:   " Commands\n"+ 
        "!roll help\n"+
        "!roll num1-num2\n"+
        "!roll num1dnum2\n",
	execute:async function(message, args) {
        
        if(!args.length==0){
            if(args[0]=="help"){
                message.channel.send(this.help);
            }
            if(args[0].includes('-')){
                let a=args[0].split('-');
                let n1=parseInt(a[0]);
                let n2=parseInt(a[1]);
                if(n1>n2){
                    message.channel.send("min>max (ты охуел?)");
                    return;
                }
                message.channel.send(getRandomInt(n1,n2));
            }else if(args[0].includes('d')){
                let a=args[0].split('d');
                let n1=parseInt(a[0]);
                let n2=parseInt(a[1]);
                let m="";
                if (a[0]>20) {
                    message.channel.send("А тебе не дохуя?\n20 хватит тебе");
                }
                for (let i = 0; i < n1; i++) {
                   m+=getRandomInt(1,n2)+"\n";
                }
                message.channel.send(m);
            }else{
                message.channel.send(getRandomInt(0,parseInt(args[0])));
            }
            return;
        }
        message.channel.send(getRandomInt(0,100));
        
	},
};
function getRandomInt(min,max) {
    return min + Math.floor(Math.random() * Math.floor(max-min));
}