import classes from './bubble.module.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function BubbleComponent({ content, isVisible }) {
    return (
        <div className={`${classes.wrapper} ${isVisible ? classes.show : ''}`}>
            <div className={classes.main}>
                <p>
                    {content}
                </p>
            </div>
        </div>
    );
}
