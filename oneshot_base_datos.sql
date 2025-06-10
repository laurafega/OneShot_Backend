-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2025 a las 14:11:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `oneshot`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

CREATE TABLE `fotos` (
  `id` int(11) NOT NULL,
  `reto_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `imagen_url` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fotos`
--

INSERT INTO `fotos` (`id`, `reto_id`, `usuario_id`, `imagen_url`, `fecha`) VALUES
(17, 12, 15, '/uploads/u15_a79735a9-78f9-41d2-ad76-99aaedac32f8.jpg', '2025-06-10 11:15:01'),
(20, 12, 13, '/uploads/u13_4079b68b-a247-4584-877a-bd66e7835151.jpg', '2025-06-10 12:14:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE `grupos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `creador_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupos`
--

INSERT INTO `grupos` (`id`, `nombre`, `codigo`, `creador_id`, `created_at`) VALUES
(20, 'Prueba', '8f0dff', 13, '2025-06-09 18:45:25'),
(21, 'prueba 2', '8f2d56', 15, '2025-06-09 18:45:25'),
(22, 'prueba3', '848fe0', 13, '2025-06-09 18:45:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ratings`
--

INSERT INTO `ratings` (`id`, `foto_id`, `usuario_id`, `rating`, `fecha`) VALUES
(1, 17, 13, 4, '2025-06-10 12:40:49'),
(9, 17, 15, 2, '2025-06-10 14:04:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retos`
--

CREATE TABLE `retos` (
  `id` int(11) NOT NULL,
  `grupo_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `creado_por` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `retos`
--

INSERT INTO `retos` (`id`, `grupo_id`, `fecha`, `descripcion`, `creado_por`) VALUES
(6, 20, '2025-06-09', 'hola', 13),
(7, 21, '2025-06-09', 'hola', 15),
(8, 22, '2025-06-10', 'hola4', 13),
(10, 21, '2025-06-10', 'hola3', 15),
(12, 20, '2025-06-10', 'hhhh', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(50) NOT NULL DEFAULT 'avatar1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `avatar`) VALUES
(1, 'laurabryam', 'laurabryam@gmail.com', '$2b$10$u2LeEzS7/pOrar0rfJ58qO8a61oDn2wDA/nrH1eVBCuH5OTGlefnW', 'avatar1'),
(2, 'Laura', 'laura2@email.com', '$2b$10$NrDWczB4UxPadpiiwYzuKO/teuc02YPmLlCC08zXerm.g3Tc4Fki2', 'avatar1'),
(3, 'bryam', 'bryam@gmail.com', '$2b$10$OqEIuhOcypiaFKdKvVYPQeSA4Nd4NbsmgtpPVAxeLAenUzuDXVJVS', 'avatar1'),
(4, 'Sofía', 'sofia@email.com', '$2b$10$uZAPZA2uwWJczq2vqggAguRjBKgQVO01b/.frL.iRXV3wdQfQSxy6', 'avatar1'),
(6, 'Sofía', 'sofia2@email.com', '$2b$10$8VykziTk5W7F1ev.tp7oYuxhy855KEU68X2xaOay8RarKIMxIFBey', 'avatar1'),
(7, 'maria', 'maria@gmail.com', '$2b$10$4UyWmzN0qRbWS9wNH5wr.OYFehTp2/PYkvp6iz1wyHws2fAxURUGO', 'avatar3'),
(8, 'cristina', 'cristina@example.com', '$2b$10$c7vzroJaq8QXr6VTYr5dxeHPuGvKsQRY0eZeXIG7oPPUPP38DyTW6', 'avatar1'),
(9, 'pablo', 'pablo@example.com', '$2b$10$pmI0gmy5raYFF9mr3HpwEuHD8mTx/B2WSO2CdNomeOjJb62zCSoNa', 'avatar1'),
(10, 'francisca', 'francisca@gmail.com', '$2b$10$B2oi3/c5pPkZTf18cfEKcOSo0tgw339lInwfhiktTCfaBQuxJpbrq', 'avatar1'),
(11, 'bianca', 'bianca@gmail.com', '$2b$10$qb4Y7i67UXOAnlENUXtctelx/y5a0gG3xPIdblwaQscJ0n07G52vS', 'avatar1'),
(12, 'samantha', 'samantha@gmail.com', '$2b$10$nwrcBOxFGbls83aH38TFJ.8TxO6lGzcUvwu9M4x7HKHd8bboQfEuO', 'avatar1'),
(13, 'sam', 'sam', '$2b$10$UK4kfEg7iQDpq3MA2oz9juWblirggpJjR6KdiqOZ4z9LHtszUwYES', 'avatar2'),
(14, 'bryam', 'bryameh@gmail.com', '$2b$10$LDP4NFmw/JsoGTXWBYZO3.ec/Xteq90VMfD6fOz5D.rgD5wMUpnby', 'avatar2'),
(15, 'bry', 'bry@gmail.com', '$2b$10$70XJneQkic/eZDVe1oln8.Czg1Dlf0YcCjAvC9wIPSpaYtmCw4aJW', 'avatar3'),
(16, 'a', 'a', '$2b$10$CLsMnAqXhsuP9wzi4.CZU.yCEad1CPHLVFu40bTRPeRrMycrZmIy.', 'avatar1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_grupos`
--

CREATE TABLE `usuarios_grupos` (
  `usuario_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL,
  `fecha_union` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_grupos`
--

INSERT INTO `usuarios_grupos` (`usuario_id`, `grupo_id`, `fecha_union`) VALUES
(13, 20, '2025-06-08 00:19:01'),
(13, 22, '2025-06-08 14:25:49'),
(15, 20, '2025-06-08 00:24:15'),
(15, 21, '2025-06-08 00:24:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `winners`
--

CREATE TABLE `winners` (
  `id` int(11) NOT NULL,
  `reto_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `puntos` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reto_id` (`reto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_rating` (`foto_id`,`usuario_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `retos`
--
ALTER TABLE `retos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_grupo_fecha` (`grupo_id`,`fecha`),
  ADD KEY `fk_creado_por` (`creado_por`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `usuarios_grupos`
--
ALTER TABLE `usuarios_grupos`
  ADD PRIMARY KEY (`usuario_id`,`grupo_id`),
  ADD KEY `grupo_id` (`grupo_id`);

--
-- Indices de la tabla `winners`
--
ALTER TABLE `winners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reto_id` (`reto_id`),
  ADD KEY `foto_id` (`foto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `fotos`
--
ALTER TABLE `fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `grupos`
--
ALTER TABLE `grupos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `retos`
--
ALTER TABLE `retos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `winners`
--
ALTER TABLE `winners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD CONSTRAINT `fotos_ibfk_1` FOREIGN KEY (`reto_id`) REFERENCES `retos` (`id`),
  ADD CONSTRAINT `fotos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `retos`
--
ALTER TABLE `retos`
  ADD CONSTRAINT `fk_creado_por` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `retos_ibfk_1` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`);

--
-- Filtros para la tabla `usuarios_grupos`
--
ALTER TABLE `usuarios_grupos`
  ADD CONSTRAINT `usuarios_grupos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuarios_grupos_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`);

--
-- Filtros para la tabla `winners`
--
ALTER TABLE `winners`
  ADD CONSTRAINT `winners_ibfk_1` FOREIGN KEY (`reto_id`) REFERENCES `retos` (`id`),
  ADD CONSTRAINT `winners_ibfk_2` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`),
  ADD CONSTRAINT `winners_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
