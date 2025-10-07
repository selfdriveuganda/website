const BLOG_QUERY = `*[_type == "blog" && slug.current == $slug][0]`;

export { BLOG_QUERY };
