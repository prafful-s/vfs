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

            }
          }
      });
    });
  }
  