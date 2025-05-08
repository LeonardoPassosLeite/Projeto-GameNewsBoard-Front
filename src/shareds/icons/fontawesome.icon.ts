import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faExpand, faImage, faPen, faPenToSquare, faSpinner } from '@fortawesome/free-solid-svg-icons';

export function registerIcons(library: FaIconLibrary): void {
  library.addIcons(faImage, faSpinner, faPen, faExpand, faPenToSquare, faArrowLeft);
}
