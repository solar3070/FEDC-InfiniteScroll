/**
 * initialState: [
 *  {
 *    id: 1,
 *    imagePath: '',
 *  }
 * ]
 */
export default function PhotoList({ $target, initialState, onScrollEnded }) {
  let isInitialize = false;

  const $photoList = document.createElement("div");
  $target.appendChild($photoList);

  this.state = initialState;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.state.isLoading) {
          console.log(entry);
          onScrollEnded();
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  let $lastLi = null;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    if (!isInitialize) {
      $photoList.innerHTML = `
      <ul class="PhotoList__photos"></ul>
    `;
      isInitialize = true;
    }

    const { photos } = this.state;

    const $photos = $photoList.querySelector(".PhotoList__photos");
    photos.forEach((photo) => {
      // photo의 id 기준으로 렌더링이 되어있는지 체크
      if ($photos.querySelector(`li[data-id="${photo.id}"]`) === null) {
        // 없으면 li 생성하고 $photos에 appendChild
        const $li = document.createElement("li");
        $li.setAttribute("data-id", photo.id);
        $li.style = "list-style: none; min-height: 200px;";
        $li.innerHTML = `<img width="100%" src="${photo.imagePath}"/>`;

        $photos.appendChild($li);
      }
    });

    const $nextLi = $photos.querySelector("li:last-child");
    if ($nextLi !== null) {
      if ($lastLi !== null) {
        observer.unobserve($lastLi);
      }
      $lastLi = $nextLi;
      observer.observe($lastLi);
    }
  };

  this.render();

  window.addEventListener("scroll", () => {
    const { isLoading, totalCount, photos } = this.state;
    const isScrollEnded =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (isScrollEnded && !isLoading && photos.length < totalCount) {
      onScrollEnded();
    }
  });
}
