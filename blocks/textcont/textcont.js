export default function decorate(block) {
 // const cols = [...block.firstElementChild.children];
  block.classList.add(`text-content-wrapper`);
  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const h2 = col.querySelector('h2');
      h2?.classList.add(`text-content-h2`);
      });
    });
  }
  