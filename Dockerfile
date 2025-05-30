# Используем официальный образ Nginx
FROM nginx:alpine

# Удаляем дефолтную конфигурацию Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу конфигурацию Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Создаем директорию для приложения
RUN mkdir -p /usr/share/nginx/html/src

# Копируем файлы приложения (только для билда, без volume)
COPY src /usr/share/nginx/html/src

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]