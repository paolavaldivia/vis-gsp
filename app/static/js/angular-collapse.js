angular.module('angular-collapse', [])
.directive('ngCollapse', ['$animate', '$timeout', function($animate, $timeout){
	return {
		link: function(scope, element, attrs){
			// main collapse class, use collapse-options to override transition settings
			element.addClass('collapse');

			var init = true;
			var config;
			var animator;

			// read in class="content" children so we can fix the size
			var contents;
			var children = element.children();
			for(var i=0; i < children.length; i++){
			  var content = angular.element(children[i]);
			  if(content.hasClass('content')){
			    if(!contents){ contents = []; }
			    contents.push({	element: content,
			    				originalWidth: content[0].style.width || (content.css('width') != '0px'?content.css('width'):'')
			    			});
			  }
			}
			function fixContentSize(reset){
				angular.forEach(contents, function(content){
					if(!content.originalWidth || content.originalWidth == 'auto'){
						if(!reset){
							var size = getRenderSize(content.element);
							content.renderWidth = size.width+'px';
							content.element.css( { width: content.renderWidth } );

						}
						else{
							content.element.css( { width: content.originalWidth } );
						}
					}
				});
			}

			function getRenderSize(element){
				var size = {};
				var clone = element.clone();
				clone.css({"visibility":"visible", "display":"table"});
				document.body.appendChild(clone[0]);
				size.width = clone[0].clientWidth;
				size.height = clone[0].clientHeight;
				document.body.removeChild(clone[0]);
				return size;
			}

			function setTransitionProperties(properties){
				var css = {};
				if(angular.isUndefined(properties)){
					// reset transition properties
				    css['-webkit-transition-property'] = css['transition-property'] = '';
				    css['-webkit-transition-duration'] = css['transition-duration'] = '';
				    css['-webkit-transition-timing-function'] = css['transition-timing-function'] = '';
				}
				else{
					// configure transition properties
				    css['-webkit-transition-property'] = css['transition-property'] = properties.join(',');
					if(config && config.duration){
						css['-webkit-transition-duration'] = css['transition-duration'] = config.duration;
					}
					if(config && config.timing){
						css['-webkit-transition-timing-function'] = css['transition-timing-function'] = config.timing;
					}
				}
				element.css(css);
			}

			function expand(){
				if(init){ return expandDone(); }

				// before setting up the animation, add the in class so the element is displayed (and we can read its rendered dimensions)
				element.addClass('in')
				  .attr('aria-expanded', true)
				  .attr('aria-hidden', false);

				// fix inner content element sizes
				fixContentSize();

			    var css = {};
			    var animate = { to: {}, from: {} };

			    // build the animation

			    var size = getRenderSize(element);

			    // vertical
			    if(!config || config.vertical){
			    	animate.from.height = '0';
			    	animate.to.height = size.height+'px';

			    	if(config && config.vertical == 'bottom'){
			    		css.position = 'relative';
			    		animate.from.top = size.height+'px';
			    		animate.to.top = '0';
			    	}
			    }

			    // horizontal
			    if(config && config.horizontal){
			    	animate.from.width = '0';
			    	animate.to.width = size.width+'px';

					if(config.horizontal == 'right'){
						css.position = 'relative';
						animate.from.left = size.width+'px';
						animate.to.left = '0';
					}
			    }

			    // set the appropriate transition properties
			    var animate_props = Object.keys(animate.to);
			    animate_props.push('visibility');
			    setTransitionProperties(animate_props);

			    // apply the css needed for the transition
			    element.css(css)

			    // cancel any existing animations
				if(animator){
					$animate.cancel(animator);
				}

				// animate with the collapsing class applied
				animator = $animate.animate(element, animate.from, animate.to, 'collapsing');
				animator.then(expandDone);
			}

			function expandDone(){
				if(animator){ animator = null; }

				// reset element's style for expanded state
				var css = {};

				// reset inner content element sizes
				fixContentSize(true);

				// vetical
				if(!config || config.vertical){
					css.height =  '';

					if(config && config.vertical == 'bottom'){
						css.position = '';
						css.top = '';
					}
				}

				// horizontal
				if(config && config.horizontal){
					css.width = '';

					if(config.horizontal == 'right'){
						css.position = '';
						css.left = '';
					}
				}

				// reset transition properties
				setTransitionProperties();

				// apply post-expand css
				element.css(css)
						.addClass('in');
			}


			function collapse(){
				if(init){ return collapseDone(); }

				var css = {};
				var animate = { to: {}, from: {} };
				var size = getRenderSize(element);

				if(!config || config.vertical){
					animate.from.height = size.height+'px';
					animate.to.height = '0';

					if(config && config.vertical == 'bottom'){
						css.position = 'relative';
						animate.from.top = '0';
						animate.to.top = size.height+'px';
					}
				}

				if(config && config.horizontal){
					animate.from.width = size.width+'px';
					animate.to.width = '0';

					if(config.horizontal == 'right'){
						css.position = 'relative';
						animate.from.left = '0';
						animate.to.left = size.width+'px';
					}
				}

				// fix inner content element sizes
				fixContentSize();

				// set the appropriate transition properties
				var animate_props = Object.keys(animate.to);
				animate_props.push('visibility');
				setTransitionProperties(animate_props);

				// apply the css needed for the transition
				element.css(css)
						.removeClass('in')	// remove the in class before animating to prevent flicker at end (collapsing class has display: block)
						.attr('aria-expanded', false)
				  		.attr('aria-hidden', true);				  

				// cancel any existing animations
				if(animator){
					$animate.cancel(animator);
				}

				// animate with the collapsing class applied
				animator = $animate.animate(element, animate.from, animate.to, 'collapsing');
				animator.then(collapseDone);
			}

			function collapseDone(){
				if(animator){ animator = null; }
				
				// reset element's style for collapsed state
				var css = {};

				// reset inner content element sizes
				fixContentSize(true);

				// vertical
				if(!config || config.vertical){
					css.height = '0';

					if(config && config.vertical == 'bottom'){
						css.position = '';
						css.top = '';
					}
				}

				// horizontal
				if(config && config.horizontal){
					css.width = '0';

					if(config.horizontal == 'right'){
						css.position = '';
						css.left = '';
					}
				}

				// reset transition properties
				setTransitionProperties();

				// apply post-collapse css
				element.css(css);
			}

			// watch the ng-collapse toggler
			scope.$watch(attrs.ngCollapse, function(shouldCollapse){
				$timeout(function(){
					if (shouldCollapse) {
					  collapse();
					} else {
					  expand();
					}
					if(init){ init = false; } // initialization done
				});
			});

			// watch the collapse-options, reading them into config
			scope.$watchCollection(attrs.collapseOptions, function(options){
				config = options;
			});
		}
	};
}]);