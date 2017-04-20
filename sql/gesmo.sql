-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2017 at 06:46 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gesmo`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `artist_id` int(10) NOT NULL,
  `release_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `name`, `image`, `artist_id`, `release_date`) VALUES
(1, 'All or Nothing', NULL, 8, '2009-11-23'),
(2, 'Art Pop', NULL, 13, '2013-11-06'),
(3, 'Bangrez', NULL, 15, '2013-10-04'),
(4, 'Black and Blue', NULL, 2, '2000-11-21'),
(5, 'Black Out', NULL, 3, '2007-10-05'),
(6, 'Break Out', NULL, 15, '2008-07-22'),
(7, 'Can\'t Be Tamed', NULL, 15, '2010-06-18'),
(8, 'Escape', NULL, 6, '1981-06-07'),
(9, 'Firestone', NULL, 12, '2014-12-01'),
(10, 'Ghost Stories', NULL, 4, '2014-05-16'),
(11, 'Glory', NULL, 3, '2016-08-26'),
(12, 'Justified', NULL, 10, '2002-11-04'),
(13, 'Killers', NULL, 7, '1981-02-02'),
(14, 'Kygo', NULL, 12, '2016-05-13'),
(15, 'Live In Texas', NULL, 14, '2003-11-18'),
(16, 'Living Things', NULL, 14, '2012-06-20'),
(17, 'Neon', NULL, 8, '2013-07-30'),
(18, 'Nights', NULL, 1, '2014-12-01'),
(19, 'Nothing Left', NULL, 12, '2015-07-31'),
(20, 'One Love', NULL, 5, '2009-08-21'),
(21, 'Pop Life', NULL, 5, '2007-06-18'),
(22, 'Prism', NULL, 11, '2013-11-18'),
(23, 'Recrimination', NULL, 10, '2008-01-01'),
(24, 'A Rush of Blood to the Head', NULL, 4, '2002-08-26'),
(25, 'Sex and Love', NULL, 6, '2014-03-18'),
(26, 'Teenage Dream', NULL, 11, '2010-08-24'),
(27, 'The Book of Souls', NULL, 7, '2015-09-04'),
(28, 'The Fame Monster', NULL, 13, '2008-08-19'),
(29, 'This is Us', NULL, 2, '2009-09-30'),
(30, 'Encore', NULL, 9, '2004-11-12'),
(31, 'Fifty Shades Darker OST', NULL, 15, '2017-02-10'),
(32, 'The Blue Carpet Treatment', NULL, 17, '2006-11-21'),
(33, 'Dark Side of the Moon', NULL, 18, '1973-03-01'),
(34, 'Stop the Clocks', NULL, 19, '2006-11-20'),
(35, 'Insecticide', NULL, 20, '1992-12-04'),
(36, 'FutureSex/LoveSounds', NULL, 10, '2006-09-08'),
(37, 'Unreleased', NULL, 14, '2010-03-01'),
(38, 'Millenium', NULL, 2, '1999-05-18'),
(39, 'The Number of the Beast', NULL, 7, '1982-03-22'),
(40, 'The 20/20 Experience', NULL, 10, '2013-03-15'),
(41, 'Rebirth', NULL, 24, '2010-02-02'),
(42, 'R&B Jamz', NULL, 10, '2014-03-10'),
(43, 'Powerslave', NULL, 7, '1984-11-03'),
(44, 'Overexposed', NULL, 23, '2012-06-20'),
(45, 'James Bond OST', NULL, 14, '1999-11-09'),
(46, 'One of the Boys', NULL, 11, '2008-06-17'),
(47, 'Thriller', NULL, 21, '1982-11-30'),
(48, 'Greatest Hits ', NULL, 2, '2001-10-23'),
(49, 'The Fame', NULL, 13, '2008-08-19'),
(50, 'Fever', NULL, 34, '2010-04-26'),
(51, 'Favorite Worst Nightmare', NULL, 37, '2007-04-18'),
(52, 'Fantasy Ride', NULL, 33, '2009-05-03'),
(53, 'Curtain Call', NULL, 31, '2005-12-06'),
(54, 'Build a Rocket Boys', NULL, 32, '2011-03-04'),
(55, 'Britney', NULL, 3, '2001-11-05'),
(56, 'Brave New World', NULL, 15, '2000-05-29'),
(57, 'Back to Bedlam', NULL, 27, '2004-10-11'),
(58, '...Baby One More Time', NULL, 3, '1999-01-12'),
(59, 'Armchair Apocrypha', NULL, 38, '2007-03-20'),
(60, 'Animal', NULL, 25, '2010-01-01'),
(61, 'Cosas del Amor', NULL, 6, '1998-09-22'),
(62, 'A Matter of Life and Death', NULL, 7, '2006-08-28'),
(64, 'Breaking Dawn', NULL, 39, '2011-11-04'),
(65, 'Konvicted', NULL, 40, '2006-11-14'),
(66, 'I Am... Sasha Fierce', NULL, 36, '2008-11-15'),
(67, 'On a Day Like Today', NULL, 35, '1998-10-27'),
(68, '808s & Heartbreak', NULL, 26, '2008-11-24'),
(69, 'Cryptic Writings', NULL, 22, '1997-06-17'),
(70, 'Uno!', NULL, 30, '2012-09-21');

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `name`, `image`) VALUES
(1, 'Avicii', NULL),
(2, 'Backstreet Boys', NULL),
(3, 'Britney Spears', NULL),
(4, 'Coldplay', NULL),
(5, 'David Guetta', NULL),
(6, 'Enrique Eglesias', NULL),
(7, 'Iron Maiden', NULL),
(8, 'Jay Sean', NULL),
(9, 'Justin Bieber', NULL),
(10, 'Justin Timberlake', NULL),
(11, 'Katy Perry', NULL),
(12, 'Kygo', NULL),
(13, 'Lady Gaga', NULL),
(14, 'Linkin Park', NULL),
(15, 'Miley Cyrus', NULL),
(16, 'Zyan Malik', NULL),
(17, 'Snoop Dong', NULL),
(18, 'Pink Floyd', NULL),
(19, 'Oasis', NULL),
(20, 'Nirvana', NULL),
(21, 'Michael Jackson', NULL),
(22, 'Megadeth', NULL),
(23, 'Maroon 5', NULL),
(24, 'Lil Wayne', NULL),
(25, 'Kesha', NULL),
(26, 'Kayne West', NULL),
(27, 'James Blunt', NULL),
(28, 'Imagine Dragons', NULL),
(29, 'Hannah Montana', NULL),
(30, 'Green Day', NULL),
(31, 'Eminem', NULL),
(32, 'Elbow', NULL),
(33, 'Ciara', NULL),
(34, 'Bullet For My Valentine', NULL),
(35, 'Bryan Adams', NULL),
(36, 'Beyonce', NULL),
(37, 'Artic Monkeys', NULL),
(38, 'Andrew Bird', NULL),
(39, 'Bruno Mars', NULL),
(40, 'Akon', NULL),
(41, 'Alicia Keys', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `name`, `image`) VALUES
(1, 'Contemporary', NULL),
(2, 'Dance', NULL),
(3, 'Pop', NULL),
(4, 'Electronic', NULL),
(5, 'Metal', NULL),
(6, 'Hip Hop', NULL),
(7, 'Intrumental', NULL),
(8, 'Rock', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `playlistmapping`
--

CREATE TABLE `playlistmapping` (
  `songid` int(10) NOT NULL,
  `playlistid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `playlistmapping`
--

INSERT INTO `playlistmapping` (`songid`, `playlistid`) VALUES
(8, 1),
(9, 1),
(10, 1),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 2),
(21, 3),
(22, 3),
(23, 3),
(24, 3),
(25, 3),
(26, 3),
(27, 3),
(28, 3),
(29, 3),
(30, 4),
(31, 4),
(32, 4),
(33, 4),
(34, 4),
(35, 4),
(36, 4),
(37, 4),
(38, 4),
(39, 4),
(40, 4),
(41, 5),
(42, 5),
(43, 5),
(44, 5),
(45, 5),
(46, 5),
(47, 5),
(48, 5),
(49, 5),
(50, 5),
(51, 6),
(52, 6),
(53, 6),
(54, 6),
(55, 6),
(56, 6),
(57, 6),
(58, 6),
(59, 6),
(60, 6),
(61, 7),
(62, 7),
(63, 7),
(64, 7),
(65, 7),
(66, 7),
(67, 7),
(68, 7),
(69, 7),
(70, 7),
(71, 8),
(72, 8),
(73, 8),
(74, 8),
(75, 8),
(76, 8),
(77, 8),
(78, 8),
(79, 8),
(80, 8),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 1),
(88, 1),
(89, 1),
(90, 1);

-- --------------------------------------------------------

--
-- Table structure for table `playlisttable`
--

CREATE TABLE `playlisttable` (
  `id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `playlisttable`
--

INSERT INTO `playlisttable` (`id`, `name`) VALUES
(1, 'Weekend'),
(2, 'Party'),
(3, 'Workout'),
(4, 'Chill'),
(5, 'Motivation'),
(6, 'Focus'),
(7, 'Decades'),
(8, 'Romace');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_uploads`
--

CREATE TABLE `tbl_uploads` (
  `id` int(10) NOT NULL,
  `file` varchar(100) NOT NULL,
  `type` varchar(30) NOT NULL,
  `size` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `artistname` varchar(50) NOT NULL,
  `artist_id` int(10) NOT NULL,
  `Genre` varchar(100) NOT NULL,
  `Album` varchar(100) DEFAULT NULL,
  `album_id` int(10) NOT NULL,
  `genre_id` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_uploads`
--

INSERT INTO `tbl_uploads` (`id`, `file`, `type`, `size`, `name`, `artistname`, `artist_id`, `Genre`, `Album`, `album_id`, `genre_id`) VALUES
(12, '85030-sound.mp3', 'audio/mp3', 558, 'The nights', 'Avicii', 1, 'EDM', 'Nights', 18, 4),
(10, '39503-running_out.mp3', 'audio/mp3', 1069, 'I dont wanna live forever', 'Zyan Malik', 15, 'EDM', 'Fifty Shades Darker OST', 31, 4),
(8, '41110-rave_digger.mp3', 'audio/mp3', 1231, 'Let me Love You', 'Justin Bieber', 9, 'EDM', 'Encore', 30, 4),
(9, '41007-ritviz---beatific-by-ritviz.mp3', 'audio/mp3', 3751, 'Ritviz', 'Avicii', 1, 'EDM', 'Nights', 18, 4),
(13, '87795-backstreet-boys-missing-u.mp3', 'audio/mp3', 4077, 'missing you', 'Backstreet Boys', 2, 'Pop', 'This is us ', 29, 3),
(14, '53367-get-down.mp3', 'audio/mp3', 3669, 'Get Down', 'Backstreet Boys', 2, 'Pop', 'Black and Blue', 4, 3),
(15, '33708-the-one.mp3', 'audio/mp3', 3565, 'The one', 'Backstreet Boys', 2, 'Pop', 'This is us', 29, 3),
(16, '48745-incomplete.mp3', 'audio/mp3', 3820, 'Incomplete', 'Backstreet Boys', 2, 'Pop', 'Black and Blue', 4, 3),
(17, '78562-britney-spears-womanizer.mp3', 'audio/mp3', 1751, 'Womanizer', 'Britney Spears', 3, 'Dance', 'Black Out', 5, 2),
(18, '65102-britney_spears_circus.mp3', 'audio/mp3', 818, 'Circus', 'Britney Spears', 3, 'Dance', 'Glory', 11, 2),
(19, '7205-britney-i-run-away.mp3', 'audio/mp3', 3823, 'I run away', 'Britney Spears', 3, 'Dance', 'Black Out ', 5, 2),
(20, '97644-toxic.mp3', 'audio/mp3', 3200, 'Toxic', 'Britney Spears', 3, 'Dance', 'Glory', 11, 2),
(21, '47494-you-drive-me-crazy.mp3', 'audio/mp3', 4701, 'You drive me crazy', 'Britney Spears', 3, 'Dance', 'Black Out', 5, 2),
(22, '80039-show-me-d-meanin.mp3', 'audio/mp3', 3672, 'show me the meaning ', 'Backstreet Boys', 2, 'Pop', 'This is us', 29, 3),
(23, '96704-david-guetta---memories-[ft.-kid-cudi].mp3', 'audio/mp3', 9810, 'One Love', 'David Guetta', 5, 'Electro House', 'One love', 20, 4),
(24, '7970-david-guetta---memories-[ft.-kid-cudi].mp3', 'audio/mp3', 9810, 'Memories', 'David Guetta', 5, 'Electro House', 'Pop Life', 21, 4),
(25, '88012-david-guetta---love-is-gone.mp3', 'audio/mp3', 3102, 'Gone', 'David Guetta', 5, 'Electro House', 'One love', 20, 4),
(26, '95816-david-guetta-ft.-akon---sexy-bitch.mp3', 'audio/mp3', 5719, 'Bitch', 'David Guetta', 5, 'Electro House', 'Pop Life', 21, 4),
(27, '78743-david_guetta_feat_akon_sexy_chick.mp3', 'audio/mp3', 1194, 'Chick', 'David Guetta', 5, 'Electro House', 'One love', 20, 4),
(28, '46627-iron-maiden---2-minutes-to-midnight.mp3', 'audio/mp3', 5681, 'Two minutes to midnight', 'Iron maiden', 7, 'Heavy metal', 'Killers', 13, 5),
(29, '39959-iron-maiden---a-matter-of-life-and-death---06---out-of-the-shadows.mp3', 'audio/mp3', 8097, 'Out of the shadows', 'Iron maiden', 7, 'Heavy metal', 'The book of souls', 27, 5),
(30, '16988-03---the-prisoner.mp3', 'audio/mp3', 11601, 'The Prisoner', 'Iron maiden', 7, 'Heavy metal', 'Killers', 13, 5),
(31, '79471-iron-maiden---the-wicker-man.mp3', 'audio/mp3', 4221, 'The wicker man', 'Iron maiden', 7, 'Heavy metal', 'The book of souls', 27, 5),
(32, '7991-iron-maiden---run-to-the-hills.mp3', 'audio/mp3', 3654, 'Run to the hills', 'Iron maiden', 7, 'Heavy metal', 'Killers', 13, 5),
(33, '17613-the-number-of-the-beast.m4a', 'audio/x-m4a', 1757, 'The number of the beasts', 'Iron maiden', 7, 'Heavy metal', 'The book of souls', 27, 5),
(34, '32865-pushing-mea-way.mp3', 'audio/mp3', 7896, 'Pushing me away', 'Linkin park', 14, 'Rock', 'Living things', 16, 8),
(35, '33801-the-world-is-not-enough.mp3', 'audio/mp3', 3690, 'The world is not enough ', 'Linkin park', 14, 'Rock', 'Living things', 16, 8),
(36, '48125-black-bird.mp3', 'audio/mp3', 3241, 'Black Bird', 'Linkin park', 14, 'Rock', 'Living things', 16, 8),
(37, '30049-linkin-park---not-alone.mp3', 'audio/mp3', 3954, 'Not Alone', 'Linkin park', 14, 'Rock', 'Life in texas', 15, 8),
(38, '78299-linkin-park---my-reason.mp3', 'audio/mp3', 5163, 'My Reason', 'Linkin park', 14, 'Rock', 'Life in texas', 15, 8),
(39, '10024-kygo---firestone-ft.-conrad-sewell.mp3', 'audio/mp3', 5213, 'Firestone', 'Kygo', 12, 'Instrumental ', 'Nothing left', 19, 7),
(40, '48666-kygo---nothing-left-(ft.-will-heard).mp3', 'audio/mp3', 5156, 'Nothing left', 'Kygo', 12, 'Instrumental ', 'Nothing left', 19, 7),
(41, '96731-kygo---stole-the-show-(feat.-parson-james).mp3', 'audio/mp3', 5229, 'Stole the show', 'Kygo', 12, 'Instrumental ', 'Firestone', 9, 7),
(42, '43947-kyla-la-grange---cut-your-teeth-(kygo-remix).mp3', 'audio/mp3', 9321, 'Remix Kygo', 'Kygo', 12, 'Instrumental ', 'Kygo', 14, 7),
(43, '92810-kygo-feat.-ella-henderson---here-for-you-(cover-art).mp3', 'audio/mp3', 5722, 'kylo', 'Kygo', 12, 'Instrumental ', 'Kygo', 14, 7),
(44, '60760-hot-and-cold.mp3', 'audio/mp3', 3640, 'Hot and cold', 'Katy perry', 11, 'Deep House', 'Prism', 22, 3),
(45, '61464-one-that-got-away.mp3', 'audio/mp3', 1778, 'One that go away', 'Katy perry', 11, 'Deep House', 'Prism', 22, 3),
(46, '37648-katy-perry---california-gurls.mp3', 'audio/mp3', 5870, 'California gurls', 'Katy perry', 11, 'Deep House', 'Teenage dream', 26, 3),
(47, '25874-katy-perry---03---waking-up-in-vegas.mp3', 'audio/mp3', 5685, 'Waking up in the vegas', 'Katy perry', 11, 'Deep House', 'Teenage dream', 26, 3),
(48, '75003-one-that-got-away.mp3', 'audio/mp3', 1778, 'One that got away', 'Katy perry', 11, 'Deep House', 'Teenage dream', 26, 3),
(49, '57250-01--hero.mp3', 'audio/mp3', 5927, 'Hero', 'Enrique', 6, 'Contemporary ', 'Sex and love', 25, 1),
(50, '65519-11--ruleta-rusa.mp3', 'audio/mp3', 5933, 'Ruleta Rusa', 'Enrique', 6, 'Contemporary ', 'Sex and love', 25, 1),
(51, '61932-18--contingo.mp3', 'audio/mp3', 7968, 'Contingo', 'Enrique', 6, 'Contemporary ', 'Escape', 8, 1),
(52, '34551-15--alabao.mp3', 'audio/mp3', 5674, 'Alabao', 'Enrique', 6, 'Contemporary ', 'Escape', 8, 1),
(53, '43170-13--sad-eyes.mp3', 'audio/mp3', 5382, 'Sad Eyes', 'Enrique', 6, 'Contemporary ', 'Escape', 8, 1),
(54, '61603-godputasmileuponyourface.jpg', 'image/jpeg', 11, 'God put a smile on your face', 'Coldplay', 4, 'Soft Rock', 'Scientist', 24, 8),
(55, '55890-02-murder.mp3', 'audio/mp3', 5271, 'Murder', 'Coldplay', 4, 'Soft Rock', 'Scientist', 24, 8),
(56, '93671-02-yellow-(the-alpha-remix).mp3', 'audio/mp3', 7493, 'Yellow', 'Coldplay', 4, 'Soft Rock', 'Ghost stories', 10, 8),
(57, '76960-the_scientist_cover_art.jpg', 'image/jpeg', 20, 'Scientist', 'Coldplay', 4, 'Soft Rock', 'Ghost stories', 10, 8),
(58, '91659-03---i-ran-away.mp3', 'audio/mp3', 6171, 'I ran away', 'Coldplay', 4, 'Soft Rock', 'Ghost stories', 10, 8),
(59, '71105-lovestoned.mp3', 'audio/mp3', 5288, 'Lovestomed', 'Justin Timberlake', 10, 'Punk ', 'Recrimination', 23, 6),
(60, '50539-087-what-goes-around-junki-room-mix.mp3', 'audio/mp3', 8061, 'What goes around', 'Justin Timberlake', 10, 'Punk ', 'Recrimination', 23, 6),
(61, '84344-rockyourbody-justintimberlake.mp3', 'audio/mp3', 4188, 'Rock your Body', 'Justin Timberlake', 10, 'Punk ', 'Recrimination', 23, 6),
(62, '36442-ciara_feat_justin_timberlake_love_sex_magic.mp3', 'audio/mp3', 857, 'Love sex magic', 'Justin Timberlake', 10, 'Punk ', 'Justified', 12, 6),
(63, '97729-mirrors--justin-timberlake.mp3', 'audio/mp3', 7660, 'Mirrors', 'Justin Timberlake', 10, 'Punk ', 'Justified', 12, 6),
(64, '90764-jay-sean-feat.-lil-jon-&-sean-paul---do-you-remember.mp3', 'audio/mp3', 8190, 'Do you remember', 'Jay Sean', 8, 'Hip Hop', 'Neon', 17, 6),
(65, '35502-jay-sean-maybe.mp3', 'audio/mp3', 4471, 'May be', 'Jay Sean', 8, 'Hip Hop', 'Neon', 17, 6),
(66, '43264-youtube---[--..jay-sean---eyes-on-you..--].mp3', 'audio/mp3', 7093, 'On your love', 'Jay Sean', 8, 'Hip Hop', 'All or nothing', 1, 6),
(67, '46228-jay_sean_ft_lil_wayne_down_down.mp3', 'audio/mp3', 3255, 'Way Down', 'Jay Sean', 8, 'Hip Hop', 'All or nothing', 1, 6),
(68, '98626-lady-gaga---love-games.mp3', 'audio/mp3', 3328, 'Love games', 'Lady Gaga', 13, 'Electro pop', 'The fame', 28, 3),
(69, '60162-lady-gaga---poker-face.mp3', 'audio/mp3', 5908, 'Poker Face', 'Lady Gaga', 13, 'Electro pop', 'The fame', 28, 3),
(70, '30291-lady-gaga---paparazzi.mp3', 'audio/mp3', 3294, 'paparzonni', 'Lady Gaga', 13, 'Electro pop', 'Art pop', 2, 4),
(71, '52180-lady_gaga_-_bad_romance__shout__-_newjams.net.mp3', 'audio/mp3', 7972, 'Bad Romance', 'Lady Gaga', 13, 'Electro pop', 'Art pop', 2, 4),
(72, '40089-lg_alejandro.mp3', 'audio/mp3', 1258, 'Alejandro', 'Lady Gaga', 13, 'Electro pop', 'Art pop', 2, 3),
(73, '51258-mc_-see_you_again.mp3', 'audio/mp3', 1461, 'See you again', 'Miley Cyrus', 15, 'Dance pop', 'Break out', 6, 3),
(74, '66815-butterfly-fly-away--miley-cyrus-and-billy-ray-cyrus--.mp3', 'audio/mp3', 7408, 'Butterfly', 'Miley Cyrus', 15, 'Dance pop', 'Break out', 6, 3),
(75, '46974-miley_cyrus-i_miss_you.mp3', 'audio/mp3', 6443, 'I miss you', 'Miley Cyrus', 15, 'Dance pop', 'Bangrez', 3, 3),
(76, '85565-miley-cyrus---breakout.mp3', 'audio/mp3', 8068, 'Breakout', 'Miley Cyrus', 15, 'Dance pop', 'Break out', 6, 3),
(77, '89048-hannah-montana---this-is-the-life.mp3', 'audio/mp3', 1397, 'This is the life', 'Miley Cyrus', 15, 'Dance pop', 'Can\'t be tamed', 7, 2),
(78, '34076-true-frnd.mp3', 'audio/mp3', 3695, 'True friend', 'Miley Cyrus', 15, 'Dance pop', 'Can\'t be tamed', 7, 2),
(79, '51524-06-armchairs.mp3', 'audio/mp3', 9882, 'armchairs', 'Andrew Bird', 38, 'Electro pop', NULL, 59, 3),
(80, '60068-i-wanna-love-you---akon.mp3', 'audio/mp3', 5793, 'I wanna Love You', 'Akon', 40, 'Rap', NULL, 65, 6),
(81, '30910-gimme-more.mp3', 'audio/mp3', 9883, 'Gimme More', 'Alicia Keys', 3, 'Dance Rock', NULL, 5, 2),
(82, '12955-04.-arctic-monkeys---balaclava.mp3', 'audio/mp3', 2712, 'Balaclava', 'Arctic Monkeys', 37, 'Dance Rock', NULL, 51, 8),
(83, '83788-beyonce---if-i-were-a-boy(3)(2).mp3', 'audio/mp3', 9694, 'If i were a boy', 'beyonce', 36, 'Electro pop', NULL, 66, 4),
(84, '62473-bruno-mars---it-will-rain.mp3', 'audio/mp3', 4565, 'It will rain', 'Bruno mars', 39, 'EDM & DANCE', NULL, 64, 2),
(85, '2232-bryan-adams---how-do-you-feel-tonight.mp3', 'audio/mp3', 4470, 'How do you feel', 'Bryan Adam', 35, 'EDM & DANCE', NULL, 67, 2),
(86, '36533-bullet_for_my_valentine_-_the_.mp3', 'audio/mp3', 10075, 'The last song', 'Bullet for my valentine', 34, 'POP', NULL, 50, 3),
(87, '36451-eminem---curtain-call---when-im-gone.mp3', 'audio/mp3', 6624, 'When i am gone', 'Eminem', 31, 'Dance', NULL, 53, 3),
(88, '25182-lil-wayne---prom-queen.mp3', 'audio/mp3', 8669, 'Prom Queen', 'Lil Wayne', 0, '24', NULL, 41, 6),
(89, '44448-kanye-west---heartless.mp3', 'audio/mp3', 4980, 'Heartless', 'Kanye West', 0, '26', NULL, 68, 8),
(90, '63945-love-somebody---maroon-5.mp3', 'audio/mp3', 9330, 'Love Somebody', 'Maroon5', 0, '23', NULL, 44, 1),
(91, '40406-michael-jackson---billy-jean.mp3', 'audio/mp3', 4599, 'Billy Jean', 'Michael Jackson', 21, 'Dance', NULL, 47, 2),
(92, '84290-been-a-son-[nirvana---incesticide].mp3', 'audio/mp3', 2276, 'Been a son', 'Nirvana', 20, 'Heavy Metal', NULL, 35, 5),
(93, '33608-pink-floyd---brain-damage.mp3', 'audio/mp3', 3603, 'Damage', 'Pink Floyd', 18, 'Dance', NULL, 33, 8),
(94, '15586-songbird-[oasis---stop-the-clocks].mp3', 'audio/mp3', 3124, 'Song Bird', 'Oasis', 19, 'Pop Rock', NULL, 34, 8),
(95, '50418-megadeath---trust.mp3', 'audio/mp3', 4853, 'Trust', 'Megadeath', 22, 'Dance', NULL, 69, 5),
(96, '34046-kesha---tik-tok.mp3', 'audio/mp3', 3203, 'Tik Tok', 'Kesha', 25, 'EDM', NULL, 60, 2),
(97, '11378-03---wisemen.mp3', 'audio/mp3', 8710, 'Wiseman', 'James Blunt', 27, 'Country ', NULL, 57, 1),
(98, '1604-green-day---oh-love.mp3', 'audio/mp3', 12053, 'Oh Love', 'Green Day', 30, 'Metal', NULL, 70, 5),
(99, '91786-01---the-birds.mp3', 'audio/mp3', 18895, 'The Birds', 'Elbows', 32, 'Jazz', NULL, 54, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlisttable`
--
ALTER TABLE `playlisttable`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `playid` (`id`);

--
-- Indexes for table `tbl_uploads`
--
ALTER TABLE `tbl_uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `album_id` (`album_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;
--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `tbl_uploads`
--
ALTER TABLE `tbl_uploads`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
