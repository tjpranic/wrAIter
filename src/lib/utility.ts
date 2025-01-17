export namespace Utility {

    let timer: NodeJS.Timeout;

    export function debounce( callback: ( ) => void, milliseconds: number = 500 ): void {
        clearTimeout( timer );

        timer = setTimeout(
            ( ) => {
                callback( );
            },
            milliseconds
        );
    }

    export function autosize( element: HTMLElement ) {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 5 + 'px';
    }

}