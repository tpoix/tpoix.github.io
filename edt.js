/*############################
             DATA
##############################*/

class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

        this.element.addEventListener('touchstart', function(evt) {
            this.xDown = evt.touches[0].clientX;
            this.yDown = evt.touches[0].clientY;
        }.bind(this), false);

    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        if ( ! this.xDown || ! this.yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) { // Most significant.
            if ( this.xDiff > 0 ) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if ( this.yDiff > 0 ) {
                this.onUp();
            } else {
                this.onDown();
            }
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }

    run() {
        this.element.addEventListener('touchmove', function(evt) {
            this.handleTouchMove(evt).bind(this);
        }.bind(this), false);
    }
}

var data = [];  
function monCode() 
{ 
   if (req.readyState == 4 && this.status == 200) 
   { 
        data = JSON.parse(this.responseText); 
        main(data);
   }
} 

function typetocolor(x){
    console.log(x);
    switch(x){
        case "TP":
            return("#ff80c0");
            break;
        case "Cours":
            return("#808000");
            break;
        case "TD":
            return("#80ffff");
            break;
        default:
            return("gray");
            break;
    }
}


function hour_torow(x){
    switch(x){
        case "08":
            return(1);
            break;
        case "09":
        case "10":
            return(2);
            break;
        case "11":
        case "12":
            return(3);
            break;
        case "14":
            return(5);
            break;
        case "15":
        case "16":
            return(6);
            break;
        case "17":
            return(7);
            break;
        default:
            return(8);
            break;
    }
}

function duree_tospan(x){
    switch(x){
        case "01":
            return(1);
            break;
        case "02":
        case "03":
            return(2);
            break;
        case "04":
        case "05":
            return(3);
            break;
        default:
            return(1);
            break;
    }
}



var req = new XMLHttpRequest();
req.open("GET", "edtdata.json", true); 
req.onreadystatechange = monCode;   // la fonction de prise en charge
req.send(); 

function init(data){
    let today = new Date();
    document.getElementById("inputDate").value = `${today.getFullYear()}-${(today.getMonth()+1 < 10)?"0":""}${today.getMonth()+1}-${today.getDate()}`;
    let dateStr = `${today.getDate()} ${month_itostr(today.getMonth())} ${today.getFullYear()}`;
    document.getElementById("date").innerHTML = dateStr;

    let isMobile = window.matchMedia("only screen and (max-width: 600px)").matches;
    if(isMobile){
        console.log("###########  MOBILE  #########")
        for(let i = 1 ; i<6 ; i++){
            document.getElementById(`day${i}`).remove();
        }
    }
    fillEDT(data);
}

function fillEDT(data){
    var elements = document.getElementsByClassName("hour");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if(isMobile){
        let today = document.getElementById("inputDate").value;
        let todayDate = new Date(today);

        document.getElementById("totalgrid").innerHTML += `<div id="day${todayDate.getDay()}" class="day"  >
            <div id="daytitle">
                <h5 class="text-white text-center">${day_itostr(todayDate.getDay())}</h5>
            </div>
        </div>`;
        let todayStr = `${todayDate.getFullYear()}-${(todayDate.getMonth()+1 < 10)?"0"+(todayDate.getMonth()+1):todayDate.getMonth()+1}-${(todayDate.getDate()<10)?"0":""}${todayDate.getDate()}`
        let a = data.filter(semaine => semaine.find(cours => cours.date === todayStr));
        if(typeof a[0] !== 'undefined'){
            if(a[0].length !== 0){
                for(let i=0; i< a[0].length ; i++){
                    var aa = a[0][i];
                    console.log("aa = " + aa);
                    let infos = "";
                    for(let j=0 ; j< aa.infostext.length ; j++){
                        infos += `<h5 ${(j==0)?'':'style="opacity:0.8"'} id="ue">${aa.infostext[j]}</h5>`;
                    }
                    if(aa.date === todayStr){ 
                        document.getElementById(`day${(todayDate.getDay())}`).innerHTML += `<div style="grid-row: ${hour_torow(aa.debut[0])} /span ${duree_tospan(aa.duree[0])}; background-color:${aa.color}; border: 0; padding: 1px; margin-bottom: 2px; border-right: 10px solid ${typetocolor(aa.infostext[aa.infostext.length-1])}" class="hour card">
                        <div style="overflow: auto;" class="p-2">
                            ${infos}
                        </div>
                    </div>`;
                    }
                }
            }
        }
    }
    else{
        let today = document.getElementById("inputDate").value;
        let todayDate = getMonday(today);
        if(todayDate.getDay()<=5){
            for(let j=0; j<5 ; j++){

                let tomorrow = new Date(todayDate);
                tomorrow.setDate(tomorrow.getDate()+j);
                let todayStr = `${tomorrow.getFullYear()}-${(tomorrow.getMonth()+1 < 10)?"0"+(tomorrow.getMonth()+1):tomorrow.getMonth()+1}-${(tomorrow.getDate()<10)?"0":""}${tomorrow.getDate()}`

                console.log(todayStr);
                let a = data.filter(semaine => semaine.find(cours => cours.date === todayStr));
                console.log(typeof a[0]);
                if(typeof a[0] !== 'undefined'){
                    if(a[0].length !== 0){
                        for(let i=0; i< a[0].length ; i++){
                            var aa = a[0][i];
                            console.log("aa = " + aa);
                            let infos = "";
                            for(let j=0 ; j< aa.infostext.length ; j++){
                                infos += `<h5 ${(j==0)?'':'style="opacity:0.8"'} id="ue">${aa.infostext[j]}</h5>`;
                            }
                            if(aa.date === todayStr){ 
                                document.getElementById(`day${j+1}`).innerHTML += `<div style="grid-row: ${hour_torow(aa.debut[0])} /span ${duree_tospan(aa.duree[0])}; background-color:${aa.color}; border: 0; padding: 1px; margin-bottom: 2px; border-right: 10px solid ${typetocolor(aa.infostext[aa.infostext.length-1])}" class="hour card">
                                <div style="overflow: auto  ;" class="p-2">
                                    ${infos}
                                </div>
                            </div>`;
                            }
                        }
                    }
                }
            }
        }
    }
}

function main(data) {
    init(data);
    document.body.addEventListener("resize", function(){
        changeDate(data);
    });
    console.log(document.getElementById("inputDate"));
    document.getElementById("inputDate").addEventListener("change", function(){
        console.log(data);
        changeDate(data);
    });
    var swiper = new Swipe(document.body);
    swiper.onLeft(function() {
         tomorrow = new Date(document.getElementById("inputDate").value);
         tomorrow.setDate(tomorrow.getDate() + 1);
         document.getElementById("inputDate").valueAsDate = tomorrow;
         changeDate(data);
        });
    swiper.onRight(function() {
         yesterday = new Date(document.getElementById("inputDate").value);
         yesterday.setDate(yesterday.getDate() - 1);
         document.getElementById("inputDate").valueAsDate = yesterday;
         changeDate(data);
    })
    swiper.onUp(function() {return 0;});
    swiper.onDown(function() {return 0;});
    swiper.run();
}





/*############################
           FONCTIONS
##############################*/

function day_itostr(x){
    switch(x){
        case 1:
            return("Lundi");
            break;
        case 2:
            return("Mardi");
            break;
        case 3:
            return("Mercredi");
            break;
        case 4:
            return("Jeudi");
            break;
        case 5:
            return("Vendredi");
            break;
        case 6:
            return("Samedi");
            break;
        case 0:
            return("Dimanche");
            break;
    }
}

function month_itostr(x){
    switch(x){
        case 0:
            return ("Janvier");
            break;
        case 1:
            return ("Février");
            break;
        case 2:
            return ("Mars");
            break;
        case 3:
            return ("Avril");
            break;
        case 4:
            return ("Mai");
            break;
        case 5:
            return ("Juin");
            break;
        case 6:
            return ("Juillet");
            break;
        case 7:
            return ("Août");
            break;
        case 8:
            return ("Septembre");
            break;
        case 9:
            return ("Octobre");
            break;
        case 10:
            return ("Novembre");
            break;
        case 11:
            return ("Décembre");
            break;
    }
}



function changeDate(data){
    let isMobile = window.matchMedia("only screen and (max-width: 600px)").matches;
    if(isMobile){
        document.getElementById(`totalgrid`).firstChild.nextSibling.nextSibling.nextSibling.remove();
    }
    let inputStr = document.getElementById("inputDate").value;
    let day = new Date(inputStr);
    let dateStr = `${day.getDate()} ${month_itostr(day.getMonth())} ${day.getFullYear()}`;
    document.getElementById("date").innerHTML = dateStr;
    fillEDT(data);
}

var getDaysInMonth = function(month,year) {
   return new Date(year, month, 0).getDate();
  };

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}
  
  getMonday(new Date());




