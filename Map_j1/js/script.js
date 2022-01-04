
var MAP_API = {
	AVIATION_API_URL: "http://localhost:8888/API/api/airports",

	map : null,
	airports: [],
	markersArray: [],

	//init
	initMap : function () {
		this.buildMap();
		this.fetchData();
		this.createAirport()
		this.initPopup();
	},

	//init le popup
	initPopup : function() {
		const popup = document.getElementsByClassName("popup")[0];
		const form = document.getElementsByClassName("formPopup")[0];
		form.addEventListener('submit', (e) =>{
			e.preventDefault()

			let airport = {}

			let inputId = document.querySelector(".formPopup input[name=id]")
			let inputName = document.querySelector(".formPopup input[name=name]")
			
			airport.id = inputId.value

			if(inputName.value)
				airport.name = inputName.value
			if(e.path[0][1].value)
				airport.latitude = e.path[0][1].value
			if(e.path[0][2].value)
				airport.longitude = e.path[0][2].value
			this.putData(airport)

			
			popup.style.display = "none";
		})


		const crossPopup = document.getElementsByClassName("crossPopup")[0];
		crossPopup.addEventListener('click',() => {
			popup.style.display = "none";
		})
		//crossPopup.
	},

	//creer la map
	buildMap : function () {
		const paris = { 
            lat: 48.8534, 
            lng: 2.3488 
        };

		// TODO
		// initialiser la google map
		map = new google.maps.Map(document.getElementById("map"), {
			center: paris,
			zoom: 8,
		  });

	},

	//get les datas
	fetchData : function () {
		// recuperer les donnees de l'API
		
		fetch(this.AVIATION_API_URL)
		.then(response => response.json())
        .then((data) => {
			if(this.airports.length!==0){
				this.refreshInterface();
			}

			for(airport in data.airports){		
				this.airports.push(data.airports[airport])
				this.addMarker(this.airports[airport])
				this.addElementToList(this.airports[airport])		
			}
         })
	},
	//delete toutes les datas
	refreshInterface : function(){
		this.airports =[];
		const myNode = document.getElementById("airports-list");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.lastChild);
		}

		
			for (var i = 0; i < this.markersArray.length; i++ ) {
			  this.markersArray[i].setMap(null);
			}
			this.markersArray.length = 0;
		  
	},
	//delete un aiport, prends un param un airport(id,name,lat,long)
	deleteData : function (airport){
		var initObject = { 
            method: 'DELETE',
            mode: 'cors',
            headers: new Headers(),
			body:JSON.stringify({id:airport.id})
        };
		fetch(this.AVIATION_API_URL,initObject)
		.then(response => response.json())
		.then(()=> this.fetchData())
	},

	//post des datas, prends un param un airport(id,name,lat,long)
	postData : function (airport){
		var initObject = { 
            method: 'POST',
            mode: 'cors',
            headers: new Headers(),
			body:JSON.stringify({
				name:airport.name,
				latitude:airport.latitude,
    			longitude:airport.longitude
			})
        };

		fetch(this.AVIATION_API_URL,initObject)
		.then(response => response.json())
		.then(()=> this.fetchData())

	},

	//put les data, prends un param un airport(id,name,lat,long)
	putData : function (airport){

		const requestBody = {
			id:airport.id,
			name:airport.name,
			latitude:airport.latitude,
			longitude:airport.longitude
		}

		var initObject = { 
            method: 'PUT',
            mode: 'cors',
            headers: new Headers(),
			body:JSON.stringify(requestBody)
        };

		fetch(this.AVIATION_API_URL,initObject)
		.then(response => response.json())
		.then( response => {
			this.fetchData()
		})
	},

	//ajoute un element a la liste, prends un param un airport(id,name,lat,long)
	addElementToList : function(airport){
		const position = { lat: Number(airport.latitude), lng: Number(airport.longitude) };
		const contenu = document.getElementById("airports-list");
		let li = document.createElement('li');
		li.classList.add('li')
		const span = document.createElement('span');
		const cross = document.createElement('div');
		cross.textContent = 'x';
		const edit = document.createElement('div')
		edit.textContent = 'edit';
		edit.setAttribute("data-id", airport.id)
		span.textContent = airport.name;

		span.addEventListener('click',() => {
			map.setZoom(7);
			map.panTo(position);
		})
		cross.addEventListener('click',() => {
			let text = "Are u sure do delete this airport ?";
			if (confirm(text) == true) {
				this.deleteData(airport)
			} 			
		})
		edit.addEventListener('click', event => {


			const currentAirport = this.airports.filter(airport => airport.id ==event.target.dataset.id);

			console.log(currentAirport[0]);
			
			const inputId = document.getElementsByClassName("inputId")[0];
			inputId.value =currentAirport[0].id;
			
			const inputName = document.getElementsByClassName("inputName")[0];
			inputName.value = currentAirport[0].name;

			const inputLat = document.getElementsByClassName("inputLat")[0];
			inputLat.value = currentAirport[0].latitude;

			const inputLong = document.getElementsByClassName("inputLong")[0];
			inputLong.value = currentAirport[0].longitude;

			const popup = document.getElementsByClassName("popup")[0];
			popup.style.display = "flex";

		})
		li.appendChild(span)
		li.appendChild(cross)
		li.appendChild(edit)
		contenu.appendChild(li);
	},

	// ajouter un marker, prends un param un airport(id,name,lat,long)
	addMarker : function ( airport ) {
		const icon = { 
			url: '../img/plane.svg',
			anchor: new google.maps.Point(10,20),
            scaledSize: new google.maps.Size(20,20)
		}
		const position = { lat: Number(airport.latitude), lng: Number(airport.longitude) };

		const marker = new google.maps.Marker({
			position: position,
			map: map,
			icon:icon
		  });

		  if(airport.name){
			const infowindow = new google.maps.InfoWindow({
				content: airport.name,
			  });
	
			  marker.addListener("click", () => {
				infowindow.open({
					anchor: marker,
					map,
					shouldFocus: true,
				  });
				
			  });
		  }
		  this.markersArray.push(marker)
	},

	//ajout d'un aéroport
	createAirport : function(){
		const airportTmp = {};
		const form = document.createElement('form');
		const input = document.createElement('input');
		const span = document.createElement('span');
		span.textContent = "airport's name"
		const inputSubmit = document.createElement('input');
		inputSubmit.type="submit"
		inputSubmit.value="Submit"
		form.appendChild(span);
		form.appendChild(input);
		form.appendChild(inputSubmit);

		form.addEventListener('submit', (e) =>{
			e.preventDefault()
			airportTmp.name = e.path[0][0].value
			this.postData(airportTmp);
			infoWindow.close()
		})

		google.maps.event.addListener(map, "dblclick", (mapsMouseEvent) => {
			airportTmp.latitude = mapsMouseEvent.latLng.toJSON().lat
			airportTmp.longitude = mapsMouseEvent.latLng.toJSON().lng
			infoWindow = new google.maps.InfoWindow({
				content:form,
				position: mapsMouseEvent.latLng,
			  });
			
			infoWindow.open({
				map,
				shouldFocus: false,
			})
			
		  });
	}
}
