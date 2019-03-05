window.onload = function () {

	moment().format();

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
			/**
			 * @description Emits a handlecard event to the parent app with the event, card text, and card index in the cardsInPlay array.
			 * @param  {event}
			 */
			cardClicked : function (event) {
				this.$emit('handlecard', { 'event' : event, 'cardText' : this.cardText, 'cardIndex' : this.cardIndex});
			}
		},
		template : `
			<div class="container memory-card memory-card-top" v-on:click="cardClicked">
				<i class="fas" v-bind:class="cardText"></i>
			</div>
			`
	})


	let app = new Vue({
		el : '#app',
		data : {
			appStorage : window.localStorage,
			cardsInPlay : [
			],
			playerStats : {
				playerMoves : 0,
				playerStartTime : 0,
				playerRating : 3,
				currentTime : '00:00',
				playerName : '',
				dirtyCheat : false
			},
			leaderBoard : {
				'Easy' : [],
				'Normal' : [],
				'Hard' : []
			},
			selectedCards : {
				correctCards : [],
				moveInProgress : 0,
				cardOne : null,
				cardTwo : null
			},
			uniqueCards : 0,
			cards : [
				'fa-ambulance','fa-apple-alt','fa-baby-carriage','fa-bacon','fa-baseball-ball','fa-basketball-ball','fa-bicycle','fa-bolt','fa-bone','fa-bookmark','fa-bowling-ball','fa-bread-slice','fa-bus','fa-calendar','fa-candy-cane','fa-car','fa-car-crash','fa-car-side','fa-carrot','fa-cat','fa-certificate','fa-cheese','fa-circle','fa-cloud','fa-cloud-meatball','fa-cloud-moon','fa-cloud-moon-rain','fa-cloud-rain','fa-cloud-showers-heavy','fa-cloud-sun','fa-cloud-sun-rain','fa-comment','fa-cookie','fa-crow','fa-dog','fa-dove','fa-dragon','fa-drumstick-bite','fa-dumbbell','fa-egg','fa-feather','fa-fighter-jet','fa-file','fa-fish','fa-folder','fa-football-ball','fa-frog','fa-futbol','fa-golf-ball','fa-hamburger','fa-heart','fa-heart-broken','fa-helicopter','fa-hippo','fa-hockey-puck','fa-horse','fa-horse-head','fa-hotdog','fa-ice-cream','fa-kiwi-bird','fa-lemon','fa-map-marker','fa-meteor','fa-moon','fa-motorcycle','fa-otter','fa-paper-plane','fa-paw','fa-pepper-hot','fa-pizza-slice','fa-plane','fa-play','fa-poo-storm','fa-quidditch','fa-rainbow','fa-rocket','fa-seedling','fa-shapes','fa-ship','fa-shopping-cart','fa-shuttle-van','fa-skating','fa-skiing','fa-skiing-nordic','fa-sleigh','fa-smog','fa-snowboarding','fa-snowflake','fa-snowplow','fa-space-shuttle','fa-spider','fa-square','fa-star','fa-stroopwafel','fa-subway','fa-sun','fa-table-tennis','fa-taxi','fa-temperature-high','fa-temperature-low','fa-tractor','fa-train','fa-tram','fa-truck','fa-truck-monster','fa-truck-pickup','fa-umbrella','fa-volleyball-ball','fa-water','fa-wheelchair','fa-wind'
			],
			modalData : {
				entername : false,
				youwin : false,
				cheat : false,
				modalTitle : '',
				modalButtonText : ''
			}

		},
		methods : {
			/**
			 * @description This method starts a new game
			 */
			newgame : function () {

				// Hide the modal
				$('#modal').hide();

				// Game Setup
				// Play the start sound and set all the player stats and card selections to their inital value.
				document.querySelector('#start').play();
				if(this.playerStats.playerName == '')
					this.playerStats.playerName = document.querySelector('#playername').value;
				this.playerStats.playerStartTime = moment();
				this.playerStats.playerMoves = 0;
				this.selectedCards.correctCards = [];
				this.selectedCards.cardOne = null;
				this.selectedCards.cardTwo = null;
				this.cardsInPlay = [];
				this.uniqueCards = document.querySelector('#level').value;
				this.dirtyCheat = false;
				// End Game Setup

				app.hidecards();

				// Make a copy of the list of cards array.
				let avaliable = this.cards.slice(0);

				// We loop throught picking cards at random and take the card out of the array so we can't pick a card twice.
				// The array lenght is used so we don't pick a index outside of the avaliable cards array.
				for(let x=0;x<this.uniqueCards;x++) {
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

			},
			/**
			 * @description This method handles the handlecard event that is emmited from the memory-card componet.
			 * @param  {object}
			 */
			handlecard : function (data) {

				// We only want to continue if the player hasn't won the game.
				if(this.selectedCards.correctCards.length / 2 < this.uniqueCards) {
					// If cardOne is null and the clicked card isn't a part of a matched pair.
					if (!this.selectedCards.cardOne && !this.selectedCards.correctCards.includes(data.cardIndex)) {

						// The Tada sound is reset incase the next card click is a match.
						document.querySelector('#tada').pause();
						document.querySelector('#tada').currentTime = 0;

						// The clicked card data is set to cardOne
						this.selectedCards.cardOne = data;
						this.selectedCards.cardOne.event.target.classList.remove('memory-card-top');
						this.selectedCards.cardOne.event.target.classList.add('animated', 'flipInX');
					}

					// Since cardOne is not null and cardTwo is null we give cardTwo the data from the clicked card.
					// We also check to make sure the clicked card hansn't already been clicked.
					else if (!this.selectedCards.cardTwo && !this.selectedCards.correctCards.includes(data.cardIndex) && data.cardIndex != this.selectedCards.cardOne.cardIndex) {

						// The clicked card is set to cardTwo
						this.selectedCards.cardTwo = data;
						this.selectedCards.cardTwo.event.target.classList.remove('memory-card-top');
						this.selectedCards.cardTwo.event.target.classList.add('animated', 'flipInX');
					}

					// Now we check to see if we have two cards that have been clicked and that we don't have a move in progress.
					// If we have a move in progress and the code below is run again it will start stacking setTimeouts in the queue
					// which will start causeing problems with cards that are clicked.
					if (this.selectedCards.cardOne && this.selectedCards.cardTwo && this.selectedCards.moveInProgress == 0) {

						// Ajust the player rating based on player moves.
						if(this.playerStats.playerMoves > this.uniqueCards * 4)
							this.playerStats.playerRating = 1;
						else if(this.playerStats.playerMoves > this.uniqueCards * 2)
							this.playerStats.playerRating = 2;
						else
							this.playerStats.playerRating = 3;

						// We have two clicked cards and aren't in a move so we start a move.
						this.selectedCards.moveInProgress = 1;
						// We increment the players move cout.
						this.playerStats.playerMoves++;

						// Checking for a card match
						if (this.selectedCards.cardOne.cardText == this.selectedCards.cardTwo.cardText) {
							// Play the TaDa sound
							document.querySelector('#tada').play();

							// We add the cards to the matched cards list.
							this.selectedCards.correctCards.push(this.selectedCards.cardOne.cardIndex)
							this.selectedCards.correctCards.push(this.selectedCards.cardTwo.cardIndex)

							// The cards are animated and cardOne and cardTwo are reset. moveInProgress is also reset.
							this.selectedCards.cardOne.event.target.classList.remove('animated', 'flipInX');
							this.selectedCards.cardTwo.event.target.classList.remove('animated', 'flipInX');
							// this.selectedCards.cardOne.event.target.classList.add('animated', 'tada');
							// this.selectedCards.cardTwo.event.target.classList.add('animated', 'tada');
							this.selectedCards.cardOne = null;
							this.selectedCards.cardTwo = null;
							this.selectedCards.moveInProgress = 0;

							// If the player has found all matching pairs then they are a winner.
							if(this.selectedCards.correctCards.length / 2 == this.uniqueCards)
								this.winner();
						}

						// If the cards aren't a matching pair then we play the slap sound and animated the card after a 2 second wait.
						// moveInProgress is reset as well as cardOne and cardTwo
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
			},
		/**
		 * @description This method is run when the player wins the game.
		 */
		winner : function () {

			// Show the winner modal with the players stats.
			app.winnerModal();

			// Play the winner sound.
			document.querySelector('#winner').play();

			// We don't add cheats to the leaderboard.
			if(!this.playerStats.dirtyCheat) {

				// Check to see if the player got on the leader board.
				let level = document.querySelector('#level option:checked').text;
				let madeIt = false;

				// If the leaderboard doesn't have 10 player on set madeIt to true.
				if(this.leaderBoard[level].length < 10 ) {
					madeIt = true;
				}
				// Otherwise we need to compare the players rating to eveyrone on the leaderboard. But if they ratings are the same we compare the time taken.
				else {
					for (leader in this.leaderBoard[level]) {
						if (this.leaderBoard[level][leader].playerRating == this.playerStats.playerRating)
							madeIt = (moment.duration(this.leaderBoard[level][leader].playerTime,'mm:ss') > moment.duration(this.playerStats.playerTime, 'mm:ss') ?  true : false);
						else
							madeIt = (this.leaderBoard[level][leader].playerRating < this.playerStats.playerRating ? true : false);
					}
				}

				// Add the players stats to the leaderboard if they made it.
				if(madeIt) {

				// Add the player to the leaderboard.
				this.leaderBoard[level].push({
					playerName : this.playerStats.playerName,
					playerTime : this.playerStats.currentTime,
					playerRating : this.playerStats.playerRating
				})

				// Sort the leaderboard by star rating and time.
				this.leaderBoard[level].sort(function (a,b) {
					if(a.playerRating != b.playerRating)
						return (a.playerRating > b.playerRating ? -1 : 1);
					else
						return (moment.duration(a.playerTime,'mm:ss') > moment.duration(b.playerTime, 'mm:ss') ? 1 : -1);
				});

				// Drop all but the top 10 leaders.
				this.leaderBoard[level].splice(10,1);

				// Store the leaderboard.
				this.appStorage.setItem('appData', JSON.stringify(this.leaderBoard));
				}
			}
		},
		/**
		 * @description This method is called if the player clicks the reset button some time after their first move.
		 * 				It resets all the playerStats and covers up the reveald cards and marks them a cheater!
		 */
		restart : function () {
			this.playerStats.playerStartTime = moment();
			this.playerStats.playerMoves = 0;
			this.playerStats.dirtyCheat = true;
			this.selectedCards.correctCards = [];
			this.selectedCards.cardOne = null;
			this.selectedCards.cardTwo = null;
			this.hidecards();
			document.querySelector('#sad').play();
		},
		/**
		 * @description This method is called when the cards need to be hidden like on a new game or a restart.
		 */
		hidecards : function () {
				// Make sure the car icons aren't visable.
				document.querySelectorAll('.memory-card').forEach(function(card) {
					card.classList.add('memory-card-top');
				})
		},
		/**
		 * @description This method adjusts the visablitly of some of the modals HTML so that it offers the player a new game.
		 */
		newgameModal : function () {
			this.modalData.modalTitle = "New Game";
			this.modalData.modalButtonText = 'New Game';
			this.modalData.entername = true;
			this.modalData.cheat = false;
			this.modalData.youwin = false;
			$('#modal').show();
		},
		/**
		 * @description This method adjusts the modal to display a winning message with player stats and a new game button.
		 */
		winnerModal : function () {
			this.modalData.modalTitle = "Winner";
			this.modalData.modalButtonText = 'Play Again';
			this.modalData.entername = false;
			this.modalData.cheat = this.playerStats.dirtyCheat;
			this.modalData.youwin = true;
			$('#modal').show();
		},
		/**
		 * @description This method closes the modal.
		 */
		closeModal : function() {
			$('#modal').hide();
		}
		},
		computed : {

			/**
			 * @description Computes the amount of card matches left to display on the scoreboard.
			 */
			matchesleft : function() {
				return this.uniqueCards - (this.selectedCards.correctCards.length / 2);
			},

			/**
			 * @description Returns true or false so the gameboard can be hidden when a game isn't started.
			 */
			renderGameBoard : function () {
				return ( this.cardsInPlay.length > 0 && this.selectedCards.correctCards.length /2 != this.uniqueCards ? true : false);
			},
			/**
			 * @description Decides if the leaderboard should be seen.
			 */
			renderLeaderBoard : function () {
				return ( this.selectedCards.correctCards.length /2 == this.uniqueCards || this.cardsInPlay.length == 0 ? true : false);
			},
			/**
			 * @description If the player is in a game and has made a move this will show the restart button.
			 */
			showRestart : function () {
				return ( this.playerStats.playerMoves > 0 && this.selectedCards.correctCards.length /2 != this.uniqueCards);
			}
		}

	})

	// We check the local storage for our data and set it or get it.
	if(!app.appStorage.getItem('appData'))
		app.appStorage.setItem('appData', JSON.stringify(app.leaderBoard));
	else
		app.leaderBoard = JSON.parse(app.appStorage.getItem('appData'));

	// This sets the current game time for the player. It updates every second. Unless a game isn't going on.
	setInterval(function() {
		if(app.playerStats.playerStartTime != 0 && app.selectedCards.correctCards.length / 2 != app.uniqueCards)
			app.playerStats.currentTime = moment(moment().diff(app.playerStats.playerStartTime)).format('mm:ss');
	},1000);

}