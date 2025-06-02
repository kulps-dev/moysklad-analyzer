FROM nginx:alpine

# Удаляем дефолтную конфигурацию
RUN rm -rf /etc/nginx/conf.d/*

# Копируем нашу конфигурацию
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Создаем необходимые директории
RUN mkdir -p /usr/share/nginx/html \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Оптимизация для production
RUN echo "alias ll='ls -la'" >> /etc/profile \
    && echo "PS1='\h:\w\$ '" >> /etc/profile

# Здоровье контейнера
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]