FROM nginx:alpine

# Удаляем дефолтную конфигурацию
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу конфигурацию
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Создаем директорию (volume будет монтироваться поверх)
RUN mkdir -p /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]