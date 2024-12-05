import classes from './loading.module.css'

export default function Loading() {
    return (
        <div className={classes.container}>
            <div className={classes.box}>
                <div className={`${classes.icon} ${classes.hex}`}></div>
            </div>
        </div>
    )
}
