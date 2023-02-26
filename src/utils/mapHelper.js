export const restrictViewBounds = ({viewState, oldViewState}) => {
    if (Math.abs(viewState.longitude - oldViewState.longitude) > 180) {
        viewState.longitude = Math.sign(oldViewState.longitude) * 180;
    }
    return viewState;
}


  