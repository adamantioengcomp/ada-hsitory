angular.module('history',[])
	.value('history',[])
	.value('status',{current:-1,goingBack:false,goingForward:false})
	.factory('History',['history','$location','status',function(history,$location,status){

			return{

				/**
				 * Navigate to the previous page
				 * @param {Object} params optional parameter that makes possible to
				 *				   change/add params of the target url before goes back.
				 *				   must be displayed as a key/value pair
				 */
				back : function(params){
					status.goingBack = true;
					(status.current > 0) ? status.current-- : status.current = 0;
					var prevUrl = history.length > 0 ? history[status.current] : "/";

					for (i in params){
						var index = prevUrl.indexOf("?"+i+"=");
						if (index < 0) index = prevUrl.indexOf("&"+i+"=");
						if (index > -1){
							var tmp = prevUrl.substr(index+1);
							if (tmp.indexOf("&") > 0){
								tmp = tmp.substr(0,tmp.indexOf("&"));
							}							
							prevUrl = prevUrl.replace(tmp,i+"="+params[i]);
						}else{
							if (prevUrl.indexOf("?") > -1)
								prevUrl += "&";
							else
								prevUrl += "?";
							prevUrl += (i + "=" + params[i]);
						}
					}

        			window.location  = "#" + prevUrl;
				},

				/**
				 * Navigate to the next page
				 */
				forward : function(){
					status.goingForward = true;
					(status.current > 0) && (status.current < (history.length-1)) ? status.current++ : status.current = 0;
					var nextUrl = history.length > 0 ? history[status.current] : "/";
        			$location.path(nextUrl);
				},

				/**
				 * Clear the history
				 */
				clear : function(){
					history = [];
				}
			};

		}])
	.run(['$rootScope','history','$location','status',function($rootScope, history,$location,status){
		
		var changeEvent = function(){
			if (!status.goingBack && !status.goingForward){				
				//history.push($location.$$url);
				status.current++;
				history[status.current] = $location.$$url;
			}else{
				status.goingBack = false;
				status.goingForward = false;
			}
		};

		$rootScope.$on('$routeChangeSuccess', function() {
			changeEvent();
	    });

	    $rootScope.$on('$stateChangeSuccess', function() {
			changeEvent();
	    });

	}]);