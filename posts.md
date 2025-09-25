---
layout: default
title: Posts
permalink: /posts/
---

# Posts

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <h2>
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      </h2>
      <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      <div class="post-excerpt">
        {{ post.excerpt }}
      </div>
    </li>
  {% endfor %}
</ul>
