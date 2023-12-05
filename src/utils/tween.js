

export function chainTweens(tweens = []){

    return tweens.reduce((current, next, i, array) => {
        
        current.chain(next);
        
        if(i !== array.length - 1){

            return next;
        }
        else {

            return array[0];
        }
    });
}