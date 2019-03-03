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
			playerStats : {
				playerMoves : 0,
				playerStartTime : 0,
				playerRating : 3,
				currentTime : 0
			},
			leaderBoard : [],
			selectedCards : {
				correctCards : [],
				moveInProgress : 0,
				cardOne : null,
				cardTwo : null
			},
			cards : [
				'fa-ambulance','fa-apple-alt','fa-baby-carriage','fa-bacon','fa-baseball-ball','fa-basketball-ball','fa-bicycle','fa-bolt','fa-bone','fa-bookmark','fa-bowling-ball','fa-bread-slice','fa-bus','fa-calendar','fa-candy-cane','fa-car','fa-car-crash','fa-car-side','fa-carrot','fa-cat','fa-certificate','fa-cheese','fa-circle','fa-cloud','fa-cloud-meatball','fa-cloud-moon','fa-cloud-moon-rain','fa-cloud-rain','fa-cloud-showers-heavy','fa-cloud-sun','fa-cloud-sun-rain','fa-comment','fa-cookie','fa-crow','fa-dog','fa-dove','fa-dragon','fa-drumstick-bite','fa-dumbbell','fa-egg','fa-feather','fa-fighter-jet','fa-file','fa-fish','fa-folder','fa-football-ball','fa-frog','fa-futbol','fa-golf-ball','fa-hamburger','fa-heart','fa-heart-broken','fa-helicopter','fa-hippo','fa-hockey-puck','fa-horse','fa-horse-head','fa-hotdog','fa-ice-cream','fa-kiwi-bird','fa-lemon','fa-map-marker','fa-meteor','fa-moon','fa-motorcycle','fa-otter','fa-paper-plane','fa-paw','fa-pepper-hot','fa-pizza-slice','fa-plane','fa-play','fa-poo-storm','fa-quidditch','fa-rainbow','fa-rocket','fa-seedling','fa-shapes','fa-ship','fa-shopping-cart','fa-shuttle-van','fa-skating','fa-skiing','fa-skiing-nordic','fa-sleigh','fa-smog','fa-snowboarding','fa-snowflake','fa-snowplow','fa-space-shuttle','fa-spider','fa-square','fa-star','fa-stroopwafel','fa-subway','fa-sun','fa-table-tennis','fa-taxi','fa-temperature-high','fa-temperature-low','fa-tractor','fa-train','fa-tram','fa-truck','fa-truck-monster','fa-truck-pickup','fa-umbrella','fa-volleyball-ball','fa-water','fa-wheelchair','fa-wind'
				]
		},
		methods : {
			newgame : function () {

				document.querySelector('#start').play();
				this.playerStats.currentTime = new Date();
				this.playerStats.playerStartTime = this.playerStats.currentTime;
				this.playerStats.playerMoves = 0;
				this.selectedCards.correctCards = [];
				this.selectedCards.cardOne = null;
				this.selectedCards.cardTwo = null;

				// Reset the cards in play list
				this.cardsInPlay = [];
				document.querySelectorAll('.memory-card').forEach(function(card) {
					card.classList.add('memory-card-top');
				})

				// Make a copy of the list of cards array.
				let avaliable = this.cards.slice(0);

				// We loop throught picking 4 cards at random and take the card out of the array so we can't pick a card twice.
				// The array lenght is used so we don't pick a index outside of the avaliable cards array.
				for(let x=0;x<21;x++) {
					let c = Math.floor(Math.random() * avaliable.length-1);
					this.cardsInPlay.push(avaliable.splice(c,1)[0]);
				}


				// We make a copy of the cardsInPlay array so that we can pair them up.
				let toPair = this.cardsInPlay.slice(0);

				// We keep picking a random index from the array and insert the removed value into the cardsInPlay array so that the pairs
				// are inserted randomly. That way the board is more random.
				while(toPair.length > 0) {
					let c = Math.floor(Math.random() * toPair.length-1);
					this.cardsInPlay.splice(Math.floor(Math.random() * this.cardsInPlay.length-1),0,toPair.splice(c,1)[0]);
				}


				console.log(this.cardsInPlay);

			},
			handlecard : function (data) {

				if(this.selectedCards.correctCards.length < 42) {
					if (!this.selectedCards.cardOne && !this.selectedCards.correctCards.includes(data.cardIndex)) {
						this.selectedCards.cardOne = data;
						this.selectedCards.cardOne.event.target.classList.remove('memory-card-top');
						this.selectedCards.cardOne.event.target.classList.add('animated', 'flipInX');
					}
					else if (!this.selectedCards.cardTwo && !this.selectedCards.correctCards.includes(data.cardIndex) && data.cardIndex != this.selectedCards.cardOne.cardIndex) {
						this.selectedCards.cardTwo = data;
						this.selectedCards.cardTwo.event.target.classList.remove('memory-card-top');
						this.selectedCards.cardTwo.event.target.classList.add('animated', 'flipInX');
					}

					if (this.selectedCards.cardOne && this.selectedCards.cardTwo && this.selectedCards.moveInProgress == 0) {
						this.selectedCards.moveInProgress = 1;
						this.playerStats.playerMoves++;

						if (this.selectedCards.cardOne.cardText == this.selectedCards.cardTwo.cardText) {
							document.querySelector('#tada').play();
							this.selectedCards.correctCards.push(this.selectedCards.cardOne.cardIndex)
							this.selectedCards.correctCards.push(this.selectedCards.cardTwo.cardIndex)
							this.selectedCards.cardOne.event.target.classList.remove('animated', 'flipInX');
							this.selectedCards.cardTwo.event.target.classList.remove('animated', 'flipInX');
							this.selectedCards.cardOne.event.target.classList.add('animated', 'tada');
							this.selectedCards.cardTwo.event.target.classList.add('animated', 'tada');
							this.selectedCards.cardOne = null;
							this.selectedCards.cardTwo = null;
							this.selectedCards.moveInProgress = 0;

							if(this.selectedCards.correctCards.length == 42)
								document.querySelector('#winner').play();
						}
						else {
							document.querySelector('#slap').play();
							setTimeout(function (cardOne, cardTwo) {
								cardOne.classList.add('memory-card-top');
								cardTwo.classList.add('memory-card-top');
								cardOne.classList.remove('animated', 'flipInX');
								cardTwo.classList.remove('animated', 'flipInX');
								app.selectedCards.cardOne = null;
								app.selectedCards.cardTwo = null;
								app.selectedCards.moveInProgress = 0;
							},2000,app.selectedCards.cardOne.event.target,app.selectedCards.cardTwo.event.target);
						}
					}
				}
			}
		},
		computed : {
			matchesleft : function() {
				return 21 - (this.selectedCards.correctCards.length / 2);
			}
		}

	})
}