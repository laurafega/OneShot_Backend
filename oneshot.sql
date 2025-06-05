-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-06-2025 a las 15:58:31
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
CREATE DATABASE IF NOT EXISTS `oneshot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `oneshot`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

DROP TABLE IF EXISTS `fotos`;
CREATE TABLE `fotos` (
  `id` int(11) NOT NULL,
  `reto_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `imagen_url` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

DROP TABLE IF EXISTS `grupos`;
CREATE TABLE `grupos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupos`
--

INSERT INTO `grupos` (`id`, `nombre`, `codigo`) VALUES
(1, 'grupo1', '49cd23'),
(2, 'grupin', '8eb3df'),
(3, 'grupito', '0864f0'),
(4, 'grupinchi', 'ba0d51'),
(5, 'grupinchi', '09426a'),
(6, 'grupito', 'ab73af'),
(7, 'Grupo de Prueba', 'b37068');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retos`
--

DROP TABLE IF EXISTS `retos`;
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
(1, 1, '2025-06-03', '¡Reto pendiente de ser definido!', 1),
(2, 1, '2025-06-04', '¡Reto pendiente de ser definido!', 3),
(5, 7, '2025-06-04', '¡Reto pendiente de ser definido!', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`) VALUES
(1, 'laurabryam', 'laurabryam@gmail.com', '$2b$10$u2LeEzS7/pOrar0rfJ58qO8a61oDn2wDA/nrH1eVBCuH5OTGlefnW'),
(2, 'Laura', 'laura2@email.com', '$2b$10$NrDWczB4UxPadpiiwYzuKO/teuc02YPmLlCC08zXerm.g3Tc4Fki2'),
(3, 'bryam', 'bryam@gmail.com', '$2b$10$OqEIuhOcypiaFKdKvVYPQeSA4Nd4NbsmgtpPVAxeLAenUzuDXVJVS'),
(4, 'Sofía', 'sofia@email.com', '$2b$10$uZAPZA2uwWJczq2vqggAguRjBKgQVO01b/.frL.iRXV3wdQfQSxy6'),
(6, 'Sofía', 'sofia2@email.com', '$2b$10$8VykziTk5W7F1ev.tp7oYuxhy855KEU68X2xaOay8RarKIMxIFBey'),
(7, 'maría', 'maria@email.com', '$2b$10$MV7k340myDALJWVtxydgRuPol.0w5QW84YeBiyEymLIj06ZQZxHj.'),
(8, 'cristina', 'cristina@example.com', '$2b$10$c7vzroJaq8QXr6VTYr5dxeHPuGvKsQRY0eZeXIG7oPPUPP38DyTW6'),
(9, 'pablo', 'pablo@example.com', '$2b$10$pmI0gmy5raYFF9mr3HpwEuHD8mTx/B2WSO2CdNomeOjJb62zCSoNa'),
(10, 'francisca', 'francisca@gmail.com', '$2b$10$B2oi3/c5pPkZTf18cfEKcOSo0tgw339lInwfhiktTCfaBQuxJpbrq');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_grupos`
--

DROP TABLE IF EXISTS `usuarios_grupos`;
CREATE TABLE `usuarios_grupos` (
  `usuario_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_grupos`
--

INSERT INTO `usuarios_grupos` (`usuario_id`, `grupo_id`) VALUES
(1, 1),
(3, 1),
(4, 1),
(8, 7),
(9, 1);

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `fotos`
--
ALTER TABLE `fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grupos`
--
ALTER TABLE `grupos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `retos`
--
ALTER TABLE `retos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
