import { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import getGallery from 'api/api';
import { Notify } from 'notiflix';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';

const PER_PAGE = '12';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [pictureId, setPictureId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getGallery(query, page);
      if (response.length === 0) {
        Notify.failure('Sorry, no images for your request :(');
      } else {
        setPictures(prevPictures => [...prevPictures, ...response]);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
    if (query && page > 0) {
      fetchData();
    }
  }, [query, page]);

  const handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    const inputValue = e.currentTarget.elements.query.value;
    if (inputValue === '') {
      Notify.failure('Please type something!');
      return;
    }
    if (inputValue !== query) {
      setIsLoading(true);
      setPictures([]);
      setQuery(inputValue);
      setPage(1);
    }
  };

  const addMorePages = async () => {
    this.setState(prevState => ({ page: prevState.page + 1, isLoading: true }));
  };

  const toggleModal = id => {
    setPictureId(id);
    setShowModal(prevState => !prevState);
  };

    return (
      <div
        style={{
          height: '100vh',
          display: 'grid',
          alignContent: 'start',
          gridTemplateColumns: '1fr',
          gridGap: 16,
          paddingBottom: 24,
          fontSize: 40,
          color: '#010101',
        }}
      >
        <Searchbar onSubmit={handleSubmit} />

        <ImageGallery
          pictures={pictures}
          toggleModal={toggleModal}
        />
        {isLoading && <Loader />}
        {pictures.length >= PER_PAGE && pictures.length % PER_PAGE === 0 && (
          <Button onClick={addMorePages} />
        )}
        {showModal && (
          <Modal
            pictures={pictures}
            id={pictureId}
            onClose={toggleModal}
            showModal={showModal}
          />
        )}
      </div>
    );
}

