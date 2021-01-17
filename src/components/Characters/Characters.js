import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import md5 from 'md5';

import styles from './Characters.module.scss';
import Modal from '../UI/Modal/Modal';
import Spinner from '../UI/Spinner/Spinner';

const Characters = props => {
    const [characters, setCharacters] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterModal, setCharacterModal] = useState(null);
    const [modalState, setModalState] = useState(true);

    const [pageNumber, setPageNumber] = useState(1);
    const limit = useState(30)[0];
    const [offset, setOffset] = useState(0);

    const observer = useRef();
    const lastCharacterElementRef = useCallback(node => {   
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);   
            }
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    // Fetching characters data from Marvel's API.
    useEffect(() => {
        setFetching(true);
        setLoading(true);

        const ts = `1`;
        const publicKey = `ba73c1557e66b8a55b0e96f5fd01e534`;
        const privateKey = `6052319c409e3777acee874a69c60d6d56952650`;
        const hash = md5(`${ts}${privateKey}${publicKey}`);
        const URL = `http://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

        axios.get(URL)
            .then(response => {
                setFetching(false);
                setLoading(false);
                setOffset(prevOffset => prevOffset + limit);
                setCharacters(prevCharacters => {
                    return [...prevCharacters,
                            ...response.data.data.results.map((char, index) => {
                                const characterImage = `${char.thumbnail.path}.${char.thumbnail.extension}`;
                                const characterComics = char.comics.items.map((comics, index) => {
                                    // Comics limit to render. (limit = 10, as mentioned in the challange)
                                    if (index <= 9) {
                                        return (
                                            <li key={comics.name}>{comics.name}</li>
                                        )
                                    } 
                                })                         
                                   
                                // Adding a "ref" property to the last element on the screen with ternary operator otherwise it's just a normal element.
                                return (
                                    <div 
                                        key={char.id} 
                                        className={styles.CharacterCard}
                                        ref={response.data.data.results.length === index + 1
                                            ? lastCharacterElementRef
                                            : null}
                                        onClick={() => characterSelectHandler(char = 
                                            {name: char.name,
                                            description: char.description,
                                            image: characterImage,
                                            comics: [...characterComics]}
                                        )}>
                                        <span>{char.name}</span>
                                        <div className={styles.CharacterImageContainer}>
                                            <img src={characterImage} alt="Character" />
                                        </div>
                                    </div>
                                )                                    
                            })
                    ];
                });          
            })
            .catch(error => {
                setFetching(false);
                setLoading(false);
                setError(true);
            });
    }, [pageNumber]);

    // Showing details(modal) for the selected character if there is one.
    useEffect(() => {
        if(selectedCharacter) {
            setCharacterModal(
                <Modal show={modalState} modalClosed={closeModalHandler}>
                    <div className={styles.CharacterModal}>
                        <div className={styles.Name}>
                            <span>{selectedCharacter.name}</span>
                        </div>
                        <div className={styles.Main}>
                            <div className={styles.SelectedCharacterImageContainer}>
                                <img src={selectedCharacter.image} alt="Selected Character"/>
                            </div>
                                <div className={styles.Description}>
                                    <span>Description</span>
                                    {selectedCharacter.description 
                                        ? <p>{selectedCharacter.description}</p>
                                        : <p>No info</p>}
                                 </div>
                        </div>
                        <div className={styles.Comics}>
                            <span>Comics which feature this character</span>
                            <ul>{selectedCharacter.comics.length 
                                ? selectedCharacter.comics 
                                : <li>No info</li>}</ul>
                        </div>
                    </div>
                </Modal>
            );
        }
    }, [selectedCharacter, modalState]);
    
    const characterSelectHandler = (char) => {
        setSelectedCharacter(char);
        setModalState(true);
    }

    const closeModalHandler = () => {
        setModalState(false);
    }

    return (
        <React.Fragment>
            <div className={styles.CharactersContainer}>
                {characters}    
                <div className={styles.Error}>{error && 'Something went wrong...'}</div>        
            </div>
            {fetching && <Spinner />}   
            {characterModal}
        </React.Fragment>
    );
}

export default Characters;
