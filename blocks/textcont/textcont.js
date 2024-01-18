export default function decorate(block) {
 // const cols = [...block.firstElementChild.children];
  console.log("123");
  block.classList.add(`text-content-wrapper`);
  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('h2');
      h2.classList.add(`text-content-h2`);
      });
    });
  }
  