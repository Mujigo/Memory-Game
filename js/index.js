window.onload = function () {

	Vue.component('memory-card', {
		props : {
			cardText : String,
			cardIndex : Number
		},
		data : function () {
			return {
				cardOrder : 0,
			}
		},
		methods : {
			cardClicked : function (event) {
				this.$emit('handlecard', { 'event' : event, 'cardText' : this.cardText, 'cardIndex' : this.cardIndex});
			}
		},
		template : `
			<div class="container memory-card memory-card-top" v-on:click="cardClicked">
				<div>
					<i class="fas" v-bind:class="cardText"></i>
				</div>
			</div>
			`
	})


	let app = new Vue({
		el : '#app',
		data : {
			cardsInPlay : [
			],
			playerMoves : 0,
			playerStartTime : 0,
			currentTime : 0,
			leaderBoard : [],
			selectedCards : {
				cardOne : null,
				cardTwo : null
			},
			cards : [
				'fa-ambulance','fa-apple-alt','fa-baby-carriage','fa-bacon','fa-baseball-ball','fa-basketball-ball','fa-bicycle','fa-bolt','fa-bone','fa-bookmark','fa-bowling-ball','fa-bread-slice','fa-bus','fa-calendar','fa-candy-cane','fa-car','fa-car-crash','fa-car-side','fa-carrot','fa-cat','fa-certificate','fa-cheese','fa-circle','fa-cloud','fa-cloud-meatball','fa-cloud-moon','fa-cloud-moon-rain','fa-cloud-rain','fa-cloud-showers-heavy','fa-cloud-sun','fa-cloud-sun-rain','fa-comment','fa-cookie','fa-crow','fa-dog','fa-dove','fa-dragon','fa-drumstick-bite','fa-dumbbell','fa-egg','fa-feather','fa-fighter-jet','fa-file','fa-fish','fa-folder','fa-football-ball','fa-frog','fa-futbol','fa-golf-ball','fa-hamburger','fa-heart','fa-heart-broken','fa-helicopter','fa-hippo','fa-hockey-puck','fa-horse','fa-horse-head','fa-hotdog','fa-ice-cream','fa-kiwi-bird','fa-lemon','fa-map-marker','fa-meteor','fa-moon','fa-motorcycle','fa-otter','fa-paper-plane','fa-paw','fa-pepper-hot','fa-pizza-slice','fa-plane','fa-play','fa-poo-storm','fa-quidditch','fa-rainbow','fa-rocket','fa-seedling','fa-shapes','fa-ship','fa-shopping-cart','fa-shuttle-van','fa-skating','fa-skiing','fa-skiing-nordic','fa-sleigh','fa-smog','fa-snowboarding','fa-snowflake','fa-snowplow','fa-space-shuttle','fa-spider','fa-square','fa-star','fa-stroopwafel','fa-subway','fa-sun','fa-table-tennis','fa-taxi','fa-temperature-high','fa-temperature-low','fa-tractor','fa-train','fa-tram','fa-truck','fa-truck-monster','fa-truck-pickup','fa-umbrella','fa-volleyball-ball','fa-water','fa-wheelchair','fa-wind'
				]
		},
		methods : {
			newgame : function () {

				currentTime = new Date();
				playerStartTime = currentTime;

				// Reset the cards in play list
				this.cardsInPlay = [];

				// Make a copy of the list of cards array.
				var avaliable = this.cards.slice(0);

				// We loop throught picking 4 cards at random and take the card out of the array so we can't pick a card twice.
				// The array lenght is used so we don't pick a index outside of the avaliable cards array.
				for(var x=0;x<21;x++) {
					var c = Math.floor(Math.random() * avaliable.length-1);
					this.cardsInPlay.push(avaliable.splice(c,1)[0]);
				}


				// We make a copy of the cardsInPlay array so that we can pair them up.
				var toPair = this.cardsInPlay.slice(0);

				// We keep picking a random index from the array and insert the removed value into the cardsInPlay array so that the pairs
				// are inserted randomly. That way the board is more random.
				while(toPair.length > 0) {
					var c = Math.floor(Math.random() * toPair.length-1);
					this.cardsInPlay.splice(Math.floor(Math.random() * this.cardsInPlay.length-1),0,toPair.splice(c,1)[0]);
				}
				console.log(this.cardsInPlay);
			},
			handlecard : function (data) {

				if(this.selectedCards.cardOne)
					console.log('Card One!')

				if (!this.selectedCards.cardOne)
					this.selectedCards.cardOne = data;
				else if (!this.selectedCards.cardTwo)
					this.selectedCards.cardTwo = data;

				if (this.selectedCards.cardOne)
					this.selectedCards.cardOne.event.target.classList.remove('memory-card-top');

				if (this.selectedCards.cardTwo)
					this.selectedCards.cardTwo.event.target.classList.remove('memory-card-top');

				if (this.selectedCards.cardOne && this.selectedCards.cardTwo) {
					if (this.selectedCards.cardOne.cardText == this.selectedCards.cardTwo.cardText) {
						this.selectedCards.cardOne = null;
						this.selectedCards.cardTwo = null;
					}
					else {
						setTimeout(function () {
							app.selectedCards.cardOne.event.target.classList.add('memory-card-top');
							app.selectedCards.cardTwo.event.target.classList.add('memory-card-top');
							app.selectedCards.cardOne = null;
							app.selectedCards.cardTwo = null;
						},2000);
					}
				}
				//console.log(`${this.selectedCards.cardOne.cardText} ${this.selectedCards.cardTwo.cardText}`);

			}
		}
	})

}