import React from 'react';
import { Helmet } from 'react-helmet-async';

// Helpers
const isString = (v) => typeof v === 'string' && v.trim().length > 0;

function sanitizeMetaArray(meta = []) {
  if (!Array.isArray(meta)) return [];
  return meta
    .map((m) => {
      if (!m || typeof m !== 'object') return null;
      const { name, property, content, charset, httpEquiv } = m;
      const out = {};
      if (isString(name)) out.name = name;
      if (isString(property)) out.property = property;
      if (isString(content)) out.content = content;
      if (isString(charset)) out.charset = charset;
      if (isString(httpEquiv)) out.httpEquiv = httpEquiv;
      // must have at least one identifying attribute and content when appropriate
      if (out.charset) return out;
      if ((out.name || out.property || out.httpEquiv) && out.content) return out;
      return null;
    })
    .filter(Boolean);
}

function sanitizeLinkArray(links = []) {
  if (!Array.isArray(links)) return [];
  return links
    .map((l) => {
      if (!l || typeof l !== 'object') return null;
      const { rel, href, as, type } = l;
      if (!isString(rel) || !isString(href)) return null;
      const out = { rel, href };
      if (isString(as)) out.as = as;
      if (isString(type)) out.type = type;
      return out;
    })
    .filter(Boolean);
}

function sanitizeScriptArray(scripts = []) {
  if (!Array.isArray(scripts)) return [];
  return scripts
    .map((s) => {
      if (!s || typeof s !== 'object') return null;
      const { src, type, innerHTML } = s;
      if (isString(src)) {
        const out = { src };
        if (isString(type)) out.type = type;
        return out;
      }
      // do not allow unsafe inline script text (skip)
      if (isString(innerHTML)) return null;
      return null;
    })
    .filter(Boolean);
}

// Sanitize children elements (JSX tags passed inside <SafeHelmet> ... )
function sanitizeChildren(children) {
  const ReactChildren = React.Children.toArray(children || []);
  const sanitized = [];
  ReactChildren.forEach((child) => {
    if (!React.isValidElement(child)) return;
    const type = child.type;
    const props = child.props || {};
    // Title
    if (type === 'title') {
      const text = props.children;
      if (isString(text)) sanitized.push(React.cloneElement(child, {}, text));
      return;
    }
    // meta
    if (type === 'meta') {
      const { name, property, content, charset, httpEquiv } = props;
      const out = {};
      if (isString(name)) out.name = name;
      if (isString(property)) out.property = property;
      if (isString(content)) out.content = content;
      if (isString(charset)) out.charset = charset;
      if (isString(httpEquiv)) out.httpEquiv = httpEquiv;
      if (out.charset || ((out.name || out.property || out.httpEquiv) && out.content)) {
        sanitized.push(React.createElement('meta', out));
      }
      return;
    }
    // link
    if (type === 'link') {
      const { rel, href, as, type: typ } = props;
      if (isString(rel) && isString(href)) {
        const out = { rel, href };
        if (isString(as)) out.as = as;
        if (isString(typ)) out.type = typ;
        sanitized.push(React.createElement('link', out));
      }
      return;
    }
    // script - only allow src scripts
    if (type === 'script') {
      const { src, type: typ } = props;
      if (isString(src)) {
        const out = { src };
        if (isString(typ)) out.type = typ;
        sanitized.push(React.createElement('script', out));
      }
      return;
    }
    // fallback: ignore other tag types
  });
  return sanitized;
}

export default function SafeHelmet(props) {
  // props can include title, meta (array), link (array), script (array), children
  const title = isString(props.title) ? props.title : undefined;
  const meta = sanitizeMetaArray(props.meta);
  const link = sanitizeLinkArray(props.link);
  const script = sanitizeScriptArray(props.script);
  const children = sanitizeChildren(props.children);

  // Build Helmet props object
  const helmetProps = {};
  if (title) helmetProps.title = title;
  if (meta.length) helmetProps.meta = meta;
  if (link.length) helmetProps.link = link;
  if (script.length) helmetProps.script = script;

  // If children sanitized is non-empty, render them as children, otherwise pass props
  if (children && children.length > 0) {
    return <Helmet {...helmetProps}>{children}</Helmet>;
  }

  return <Helmet {...helmetProps} />;
}
