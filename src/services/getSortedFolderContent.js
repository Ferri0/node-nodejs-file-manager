/**
 * Service function, parse folder content array and return it as sorted array
 *
 * @param {array} folderContent - Array with filenames retrieved via readdir method
 * @returns {array} - Parsed folder content array
 */
export const getSortedFolderContent = (folderContent) => {
    const files = folderContent.filter((el) => el.type === 'file');
    const directories = folderContent.filter((el) => el.type === 'directory');

    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    const sortedDirectories = directories.sort((a, b) => a.name.localeCompare(b.name));

    return [...sortedDirectories, ...sortedFiles];
};
