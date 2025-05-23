import React, {useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WibuRegister from '../../assets/images/wibu/WibuRegister';
import GoogleIcon from '../../assets/icons/GoogleIcon';
import {
  ArrowLeft,
  User,
  Sms,
  Lock,
  Eye,
  EyeSlash
} from "iconsax-react-nativejs";


const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    setError('');
  };

  const handleSubmit = async () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.navigate('Welcome');
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Simulate Google sign-in
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.navigate('Welcome');
    } catch (err) {
      setError('Đăng ký với Google thất bại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  const renderInput = ({
    icon,
    placeholder,
    field,
    secure = false,
    showSecure,
    toggleSecure,
  }) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={formData[field]}
          onChangeText={text => handleChange(field, text)}
          secureTextEntry={secure && !showSecure}
          keyboardType={field === 'email' ? 'email-address' : 'default'}
          autoCapitalize={field === 'email' ? 'none' : 'sentences'}
        />
        {secure && (
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleSecure}>
            {showSecure ? (
              <Eye size={24} color="#fff" variant="Linear" />
            ) : (
              <EyeSlash size={24} color="#fff" variant="Linear" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft size="32" color="#ffffff" variant="Outline"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <WibuRegister width={170} height={170} />
        </View>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bắt đầu hành trình mới!</Text>
            <Text style={styles.subtitle}>
              SoundClone sẽ đồng hành cùng bạn
            </Text>
          </View>
          <View style={styles.formContainer}>
            {renderInput({
              icon: <User color="#ffffff" size={22} variant="Bold" />,
              placeholder: 'Nhập họ và tên',
              field: 'username',
            })}
            {renderInput({
              icon: <Sms color="#ffffff" size={22} variant="Bold" />,
              placeholder: 'Nhập email của bạn',
              field: 'email',
            })}
            {renderInput({
              icon: <Lock color="#ffffff" size={22} variant="Bold" />,
              placeholder: 'Nhập mật khẩu',
              field: 'password',
              secure: true,
              showSecure: showPassword,
              toggleSecure: () => setShowPassword(!showPassword),
            })}
            {renderInput({
              icon: <Lock color="#ffffff" size={22} variant="Bold" />,
              placeholder: 'Nhập lại mật khẩu',
              field: 'passwordConfirm',
              secure: true,
              showSecure: showConfirmPassword,
              toggleSecure: () => setShowConfirmPassword(!showConfirmPassword),
            })}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Text>
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity
              style={[styles.googleButton, loading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={loading}>
              <GoogleIcon width={20} height={20} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.registerLink}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#000'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {marginRight: 16},
  backIcon: {color: '#fff', fontSize: 24},
  headerTitle: {fontSize: 24, fontWeight: 'bold', color: '#fff'},
  container: {flex: 1, padding: 24},
  logoContainer: {alignItems: 'center', marginBottom: 24},
  logo: {width: 170, height: 170},
  content: {flex: 1, justifyContent: 'center', gap: 24},
  textContainer: {alignItems: 'center'},
  title: {fontSize: 28, fontWeight: 'bold', color: '#fff'},
  subtitle: {fontSize: 16, color: '#ccc'},
  formContainer: {gap: 16},
  inputContainer: {position: 'relative'},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    height: 50,
    paddingHorizontal: 12,
  },
  inputIcon: {marginRight: 12},
  input: {flex: 1, color: '#fff', fontSize: 16, height: '100%'},
  eyeIcon: {paddingHorizontal: 12},
  errorText: {color: '#ff4444', textAlign: 'center', marginBottom: 16},
  button: {
    backgroundColor: '#1DB954',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {opacity: 0.7},
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: {flex: 1, height: 1, backgroundColor: '#fff', opacity: 0.3},
  dividerText: {color: '#fff', fontSize: 14},
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 25,
  },
  googleIcon: {width: 20, height: 20},
  googleButtonText: {color: '#000', fontSize: 16},
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 16,
  },
  registerText: {fontSize: 14, color: '#fff'},
  registerLink: {fontSize: 14, color: '#1DB954', fontWeight: '600'},
});

export default RegisterScreen;
