/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */

export default function save( { attributes } ) {
    const { numberOfSlides, posts } = attributes;

    const blockProps = useBlockProps.save();

    return (
        <div { ...blockProps }>
            <div className="home-slider">
                {posts &&
                    posts.slice( 0, numberOfSlides ).map( ( post, index ) => (
                        <div key={ post.id } className={ `slide ${ index === 0 ? 'active' : '' }` }>
                            {post.featured_media && (
                                <img
                                    src={ post.featured_media.source_url }
                                    alt={ post.featured_media.alt_text || '' }
                                />
                            )}
                            <h3>{ post.title.rendered }</h3>
                        </div>
                    ) )}
            </div>
        </div>
    );
}

