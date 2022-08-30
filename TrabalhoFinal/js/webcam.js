

var secContainer = document.getElementById("sec-container");
var statusConfig = document.getElementById("status-config")
var statusSec = document.getElementById("status-sec");

var sequencia = [];
var numSequencia = [4,5,6];
var sequenciaAtual = 0;
var statusCores = [false, false, false, false];
var verificarAcerto = false;
var ssi;


function tocarAudio(audio){
	var audio = new Audio('boops/'+audio+'.mp3');
	audio.play();
}

function comecar(){
	document.getElementById("btn-comecar").onclick="";
	document.getElementById("btn-comecar").innerHTML = "Iniciado";
	gerarSequencia(numSequencia[sequenciaAtual]);
}

function recomecar(){

	var sequencia = [];
	var sequenciaAtual = 0;
	var statusCores = [false, false, false, false];
	var verificarAcerto = false;
	secContainer.style.display = "block";
	statusSec.innerHTML = "60";
	statusConfig.innerHTML = "Aguarde";
	clearTimeout(ssi);

	setTimeout(function(){
		gerarSequencia(numSequencia[sequenciaAtual]);
	}, 2000);
}


function novaSequencia(){
	var sequencia = [];
	var statusCores = [false, false, false, false];
	var verificarAcerto = false;
	statusSec.innerHTML = "60";
	statusConfig.innerHTML = "Aguarde";
	clearTimeout(ssi);

	setTimeout(function(){
		gerarSequencia(numSequencia[sequenciaAtual]);
	}, 2000);
}

function webcam(){

	const videoElement = document.getElementById("webcam");	

	const width = videoElement.width;
	const height = videoElement.height;

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');

	var mapa = document.getElementById("mapa");
	var mapaContext = mapa.getContext('2d');
	
	var areaUm = document.getElementById('wa-um');
	var areaDois = document.getElementById('wa-dois');
	var areaTres = document.getElementById('wa-tres');
	var areaQuatro = document.getElementById('wa-quatro');

	const widthArea = areaUm.width;
	const heightArea = areaUm.height;

	const areaUmOffsetLeft = areaUm.offsetLeft;
	const areaUmOffsetTop = areaUm.offsetTop;

	const areaDoisOffsetLeft = areaDois.offsetLeft;
	const areaDoisOffsetTop = areaDois.offsetTop;

	const areaTresOffsetLeft = areaTres.offsetLeft;
	const areaTresOffsetTop = areaTres.offsetTop;

	const areaQuatroOffsetLeft = areaQuatro.offsetLeft;
	const areaQuatroOffsetTop = areaQuatro.offsetTop;

    navigator.mediaDevices.getUserMedia({video:{width: width, height: height}}).then(stream=>{

		    videoElement.srcObject = stream;

			const atualizacao =  setInterval(function(){
			
				if (typeof lastImageData === 'undefined'){
					var imagemAnterior = context.getImageData(0, 0, width, height);
				}

				context.drawImage(videoElement, 0, 0, width, height);
				
				const imagemAtual = context.getImageData(0, 0, width, height);  
  				const mapa = mapaContext.getImageData(0, 0, width, height);


				for (let i = 0; i< mapa.data.length; i+=4) {
				    
				    media = Math.abs((imagemAtual.data[i]+imagemAtual.data[i+1]+imagemAtual.data[i+2])-(imagemAnterior.data[i]+imagemAnterior.data[i+1]+imagemAnterior.data[i+2]))/3;
				   	media = media > 21 ? 255 : 0;

				    mapa.data[i] = media;
				    mapa.data[i+1] = media;
				    mapa.data[i+2] = media;
				    mapa.data[i+3] = 255;
				}

				mapaContext.putImageData(mapa, 0, 0);

				if(verificarAcerto){
					verificar(mapaContext,areaUmOffsetLeft,areaUmOffsetTop,widthArea,heightArea, areaUm, 3);
					verificar(mapaContext,areaDoisOffsetLeft,areaDoisOffsetTop,widthArea,heightArea, areaDois, 2);
					verificar(mapaContext,areaTresOffsetLeft,areaTresOffsetTop,widthArea,heightArea, areaTres, 1);
					verificar(mapaContext,areaQuatroOffsetLeft,areaQuatroOffsetTop,widthArea,heightArea, areaQuatro, 0);
				}

  				imagemAnterior = imagemAtual;   
				
			},1000/30);			

		}).catch(error=>{
			console.log(error);
		});

		
		
		
}


function verificar(mapaContext,areaOffsetLeft,areaOffsetTop,widthArea,heightArea,area,index){

	if(statusCores[index]){
		return;
	}

	statusCores[index] = true;

	var vef = mapaContext.getImageData(areaOffsetLeft,areaOffsetTop,widthArea,heightArea);
	var qtd = 0;

	for (let j = 0; j< vef.data.length; j+=4) {
	    var x = Math.abs(vef.data[j]+vef.data[j+1]+vef.data[j+2])/3;
	   	x = x > 21 ? 255 : 0;
	   	
	   	if(x == 255){
	   		qtd++;
	   	}
	}

	if(qtd / (vef.data.length/4) > 0.10){

		if(acerto(index)){
			verificarAcerto = false;
			tocarAudio('acerto');
			setTimeout(function (){
				verificarAcerto = true;
			}, 1000);

			sequencia.shift();
			printSequencia();

			if(fezSequencia()){
				console.log('sequencia = ' + sequenciaAtual);
				if(sequenciaAtual < 2){ 
					sequenciaAtual++;
					novaSequencia();
				}
				else {
					vitoria();
				}
			}

		}
		else {
			derrota();
			console.log('errou');
		}
	}
	statusCores[index] = false;
}

function acerto(numero){
	return sequencia[0] == numero;
}

function derrota(){
	window.location.href = 'derrota.html';
	verificarAcerto = false;
	clearTimeout(ssi);
}

function vitoria(){
	verificarAcerto = false;
	window.location.href = 'vitoria.html';
	clearTimeout(ssi);
}

function fezSequencia(){
	return sequencia.length == 0;
}

function gerarSequencia(seq){
	
	var i = 0;
	var gsi = setInterval(function() {
		console.log("i = " + i + " (max = "+seq+")");
		if(i >= seq){
			statusConfig.innerHTML = "Iniciado";

			ssi = setInterval(function(){
				var segundosText = statusSec.innerHTML;
				var segundosInt = parseInt(segundosText);

				if( segundosInt <= 0){
					derrota();
					return;
				}

				segundosInt--;
				statusSec.innerHTML = segundosInt + "";

			}, 1000);

			console.log("verificar");
			verificarAcerto = true;

			clearTimeout(gsi);
			return;
		}

		sequencia[i] = getRandomArbitrary(0,4);
		console.log(sequencia[i]);
		var audio = new Audio('boops/'+sequencia[i]+'.mp3');
		audio.play();
		i++;
	}, 1500);
	
}

function printSequencia(){
	console.log('------');
	for(i = 0; i < sequencia.length; i++){
		console.log(sequencia[i]);
	}
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


window.addEventListener("DOMContentLoaded", webcam);