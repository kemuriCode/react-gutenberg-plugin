/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

import { useState, useEffect } from '@wordpress/element';
import { PanelBody, RangeControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
    const { numberOfSlides } = attributes;
    const [posts, setPosts] = useState([]);
    const [ activeSlide, setActiveSlide ] = useState( 0 );

    useEffect(() => {
        getPosts();
    }, [numberOfSlides]);

    const getPosts = async () => {
        const response = await fetch('/wp-json/wp/v2/posts?_embed');
        const postsData = await response.json();
        setPosts(postsData);
        setAttributes({ posts: postsData });
    };

    const handlePrevSlide = () => {
        setActiveSlide( ( activeSlide - 1 + posts.length ) % posts.length );
    };

    const handleNextSlide = () => {
        setActiveSlide( ( activeSlide + 1 ) % posts.length );
    };

    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Slider Settings">
                    <RangeControl
                        label="Number of slides"
                        value={ numberOfSlides }
                        onChange={ ( value ) => setAttributes( { numberOfSlides: value } ) }
                        min={ 1 }
                        max={ 10 }
                    />
                </PanelBody>
            </InspectorControls>
            <div { ...blockProps }>
                <div className="home-slider">
                    { posts.map( ( post, index ) => {
                        const { title, featured_media_src_url } = post;
                        const slideClasses = [ 'home-slider__slide' ];
                        if ( index === activeSlide ) {
                            slideClasses.push( 'home-slider__slide--active' );
                        }
                        return (
                            <div className={ slideClasses.join( ' ' ) } key={ index }>
                                <img src={ featured_media_src_url } alt={ title.rendered } />
                                <h2>{ title.rendered }</h2>
                                <a href={ post.link }>Czytaj dalej</a>
                            </div>
                        );
                    } ) }
                </div>
                <button onClick={ handlePrevSlide }>Poprzedni</button>
                <button onClick={ handleNextSlide }>Następny</button>
            </div>
        </>
    );
}

