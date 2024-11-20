<?php
/*
Plugin Name: Firebase Leaderboard
Description: Display custom leaderboards using Firebase data
Version: 1.0.1
Author: Utku Akyuz
*/

if (!defined('ABSPATH')) exit;

// Debug line - remove after testing
add_action('init', function() {
    error_log('Firebase Leaderboard Plugin initialized');
});

function enqueue_leaderboard_scripts() {
    wp_enqueue_script(
        'firebase-leaderboard',
        plugins_url('assets/js/leaderboard.js', __FILE__),
        array(),
        '1.0.0',
        true
    );

    // Update the REST API URL format
    wp_localize_script('firebase-leaderboard', 'firebaseLeaderboard', array(
        'apiUrl' => rest_url('firebase-leaderboard/v1/users/')
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_leaderboard_scripts');

class FirebaseLeaderboard {
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_shortcode('firebase_leaderboard', array($this, 'leaderboard_shortcode'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'Firebase Leaderboard',
            'Leaderboard',
            'manage_options',
            'firebase-leaderboard',
            array($this, 'admin_page'),
            'dashicons-chart-bar'
        );
    }

    public function enqueue_admin_scripts($hook) {
        if ($hook != 'toplevel_page_firebase-leaderboard') {
            return;
        }

        wp_enqueue_style(
            'firebase-leaderboard-admin',
            plugins_url('assets/css/admin.css', __FILE__),
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'firebase-leaderboard-admin',
            plugins_url('assets/js/admin.js', __FILE__),
            array('jquery'),
            '1.0.0',
            true
        );
    }

    public function enqueue_frontend_scripts() {
        // Firebase SDK scripts
        wp_enqueue_script('firebase-app', 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js', array(), null, true);
        wp_enqueue_script('firebase-auth', 'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js', array('firebase-app'), null, true);
        wp_enqueue_script('firebase-firestore', 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js', array('firebase-app', 'firebase-auth'), null, true);
        
        // Remove auto-animate for now
        // wp_enqueue_script('auto-animate', 'https://cdn.jsdelivr.net/npm/@formkit/auto-animate', array(), '0.8.1', true);
        
        wp_enqueue_style(
            'firebase-leaderboard-style',
            plugins_url('assets/css/leaderboard.css', __FILE__),
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'firebase-leaderboard',
            plugins_url('assets/js/leaderboard.js', __FILE__),
            array('firebase-app', 'firebase-firestore'),
            '1.0.0',
            true
        );

        // Add this new code to localize the script
        wp_localize_script(
            'firebase-leaderboard',
            'wpApiSettings',
            array(
                'nonce' => wp_create_nonce('wp_rest'),
                'root' => esc_url_raw(rest_url())
            )
        );
    }

    public function leaderboard_shortcode($atts) {
        $atts = shortcode_atts(array(
            'limit' => 10,
            'path' => 'scores'
        ), $atts);

        wp_enqueue_style('firebase-leaderboard-style');
        
        $html = '<div class="firebase-leaderboard">';
        $html .= '<div id="leaderboard-container" data-path="' . esc_attr($atts['path']) . '" 
                  data-limit="' . esc_attr($atts['limit']) . '" 
                  data-plugin-url="' . esc_attr(plugins_url('', __FILE__)) . '"></div>';
        $html .= '</div>';
        
        return $html;
    }

    public function admin_page() {
        // Register settings
        register_setting('firebase_leaderboard_settings', 'firebase_db_url');
        register_setting('firebase_leaderboard_settings', 'firebase_api_key');
        register_setting('firebase_leaderboard_settings', 'firebase_project_id');

        // Check if the template file exists
        $template_path = plugin_dir_path(__FILE__) . 'templates/admin-page.php';
        if (file_exists($template_path)) {
            include $template_path;
        } else {
            // Fallback if template file is missing
            ?>
            <div class="wrap">
                <h1>Firebase Leaderboard Settings</h1>
                <form method="post" action="options.php">
                    <?php settings_fields('firebase_leaderboard_settings'); ?>
                    <table class="form-table">
                        <tr>
                            <th>Firebase Database URL</th>
                            <td>
                                <input type="text" name="firebase_db_url" 
                                       value="<?php echo esc_attr(get_option('firebase_db_url')); ?>" 
                                       class="regular-text">
                            </td>
                        </tr>
                        <tr>
                            <th>API Key</th>
                            <td>
                                <input type="text" name="firebase_api_key" 
                                       value="<?php echo esc_attr(get_option('firebase_api_key')); ?>" 
                                       class="regular-text">
                            </td>
                        </tr>
                        <tr>
                            <th>Project ID</th>
                            <td>
                                <input type="text" name="firebase_project_id" 
                                       value="<?php echo esc_attr(get_option('firebase_project_id')); ?>" 
                                       class="regular-text">
                            </td>
                        </tr>
                    </table>
                    <?php submit_button(); ?>
                </form>

                <div class="shortcode-info">
                    <h2>How to Use</h2>
                    <p>Use this shortcode to display the leaderboard in any post or page:</p>
                    <code>[firebase_leaderboard]</code>
                    <p>Optional parameters:</p>
                    <ul>
                        <li><code>[firebase_leaderboard limit="20"]</code> - Show top 20 players</li>
                        <li><code>[firebase_leaderboard path="custom/path"]</code> - Custom data path</li>
                    </ul>
                </div>
            </div>
            <?php
        }
    }
}

new FirebaseLeaderboard(); 