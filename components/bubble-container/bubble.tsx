import classes from './bubble.module.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function BubbleComponent({content, isVisible}) {
    return (
        <div className={`${classes.main} ${isVisible ? classes.show : ''}`}>
            <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {content}
             </h4>
        </div>
    );
}
