# Используем официальный образ Nginx
FROM nginx:alpine

# Удаляем дефолтную конфигурацию Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу конфигурацию Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d

# Копируем файлы приложения
COPY src /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]