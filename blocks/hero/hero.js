export default function decorate(block) {

  const cols = [...block.firstElementChild.children];
  block.classList.add(`hero1-${cols.length}`);
  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
          if (picWrapper && picWrapper.children.length === 1) {
            // picture is only content in column
            picWrapper.classList.add('hero1-img-col');
            var heroImgColElements = document.getElementsByClassName("hero1-img-col");
                      for (var i = 0; i < heroImgColElements.length; i++) {
                        // Get the immediate parent div of the current "hero1-img-col" element
                        var parentDiv = heroImgColElements[i].parentElement;
                    
                        // Add a new class to the parent div
                        parentDiv.classList.add("image-wrapper");
                      }
                   
                     var imageWrapperElements = document.getElementsByClassName("image-wrapper");
                      for (var i = 0; i < imageWrapperElements.length; i++) {
                        var siblingDiv = imageWrapperElements[i].nextElementSibling;
                        siblingDiv.classList.add("text-wrapper");
                      }
                      var imgElement = document.querySelector(".hero1-img-col img")
                      var imageUrl = imgElement.src;

                      // Set the background image for the hero div
                      var heroDiv = document.querySelector(".hero.block.hero1-1");
                      heroDiv.style.backgroundImage = "url('" + imageUrl + "')";
                     const picture = document.querySelector(".image-wrapper");
                     picture.innerHTML="";

                     // Set the width and height dynamically
                     heroDiv.style.width = '100%';
                     heroDiv.style.height = '400px';

                      // Set background image and other properties
                      
                      heroDiv.style.backgroundSize = 'cover';
                      heroDiv.style.backgroundPosition = 'center';

            }
          }
     
      });
      const btn = row.querySelector('a');
      if(btn){
       btn.classList.add('hero-btn');
      }
    });
  }
  