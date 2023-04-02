import axios from 'axios';

export default async function fetchImages(inputValue, pageNum) {
  return await axios
    .get(
      `https://pixabay.com/api/?key=34778993-135c0d8fc9cf3fbddda72c8be&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNum}`
    )
    .then(response => response.data);
}
