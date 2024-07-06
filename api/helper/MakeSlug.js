 const createSlug=(name)=> {
    // Convert the name to lowercase
    let slug = name.toLowerCase();
  
    // Replace spaces with hyphens using a regular expression
    slug = slug.replace(/\s+/g, '-');
  
    // Remove special characters and keep only alphanumeric characters and hyphens
    slug = slug.replace(/[^\w-]/g, '');
  
    return slug;
  }
  
  export default createSlug